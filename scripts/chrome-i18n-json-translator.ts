// Chrome i18n JSON Translator (CLI)
// ---------------------------------
//
// Usage examples:
// npx tsx chrome-i18n-json-translator.ts \
//   --input "_locales/en/**/*.json" src/locales/en/messages.json \
//   --excluded-input "**/node_modules/**" \
//   --output-dir _locales/ja \
//   --target-lang ja \
//   --source-lang en \
//   --model gemini-1.5-pro \
//   --key "appTitle" \
//   --key-regex "/^menu_/" \
//   --key-regex "button_(save|cancel)"
//
// Notes:
// - Only JSON files are processed. The script assumes Chrome i18n messages.json shape:
//   { "someKey": { "message": "...", "description": "..." } }
// - Only the `message` field is translated. `description` is passed as context.
// - You can target keys by exact match (--key) and/or regex (--key-regex). If none provided, all keys are translated.
// - Output directory mirrors original structure under --output-dir.
// - Existing translation files are preserved. Only keys that need translation are updated/added.
// - Requires env GOOGLE_GENERATIVE_AI_API_KEY.

import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import fg from "fast-glob";
import globParent from "glob-parent";
import fs from "fs-extra";
import path from "node:path";

import {
    command,
    run,
    binary,
    option,
    string,
    optional,
    array,
    multioption,
    flag,
} from "cmd-ts";

type ChromeI18nEntry = {
    message?: string;
    description?: string;
    placeholders?: Record<string, unknown>;
    [k: string]: unknown;
};

type ChromeI18nFile = Record<string, ChromeI18nEntry>;

const cmd = command({
    name: "chrome-i18n-translator",
    description: "Translate Chrome i18n JSON files (message fields only) using Google Gemini with incremental support.",
    args: {
        inputsRaw: multioption({
            long: "input",
            type: array(string),
            description: "Input JSON file(s) or globs. Repeatable.",
        }),
        excludedRaw: multioption({
            long: "excluded-input",
            type: array(string),
            description: "Exclude glob(s). Repeatable.",
        }),
        outputDir: option({
            long: "output-dir",
            type: string,
            description: "Output directory (required)",
        }),
        targetLang: option({
            long: "target-lang",
            type: string,
            description: "Target language (required)",
        }),
        sourceLang: option({
            long: "source-lang",
            type: optional(string),
            description: "Source language (optional)",
        }),
        modelName: option({
            long: "model",
            type: string,
            description: "Model name for Google Generative AI (required)",
        }),
        keysExact: multioption({
            long: "key",
            type: array(string),
            description: "Translate only these exact keys (repeatable).",
        }),
        keysRegex: multioption({
            long: "key-regex",
            type: array(string),
            description: "Translate keys matching these regex. Accepts 'menu_.*' or '/^menu_.*/i' (repeatable).",
        }),
        excludeKeysExact: multioption({
            long: "exclude-key",
            type: array(string),
            description: "Exclude these exact keys (repeatable).",
        }),
        excludeKeysRegex: multioption({
            long: "exclude-key-regex",
            type: array(string),
            description: "Exclude keys matching these regex (repeatable).",
        }),
        batchCharLimitStr: option({
            long: "batch-chars",
            type: optional(string),
            description: "Max characters per translation batch (default 12000).",
        }),
        forceRetranslate: flag({
            long: "force-retranslate",
            description: "Force retranslation of keys that already exist in target files.",
        }),
        dryRun: flag({
            long: "dry-run",
            description: "Parse, select keys, and show plan without calling the model or writing files.",
        }),
    },
    handler: async (args) => {
        await main(args);
    },
});

async function main({
    inputsRaw,
    excludedRaw,
    outputDir,
    targetLang,
    sourceLang,
    modelName,
    keysExact,
    keysRegex,
    excludeKeysExact,
    excludeKeysRegex,
    batchCharLimitStr,
    forceRetranslate,
    dryRun,
}: {
    inputsRaw: string[];
    excludedRaw: string[];
    outputDir: string;
    targetLang: string;
    sourceLang?: string | undefined;
    modelName: string;
    keysExact: string[];
    keysRegex: string[];
    excludeKeysExact: string[];
    excludeKeysRegex: string[];
    batchCharLimitStr?: string | undefined;
    forceRetranslate?: boolean;
    dryRun?: boolean;
}) {
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
        console.error("Error: GOOGLE_GENERATIVE_AI_API_KEY is not set.");
        process.exit(1);
    }
    if (!inputsRaw || inputsRaw.length === 0) {
        console.error("Error: at least one --input is required.");
        process.exit(1);
    }

    const batchCharLimit = Math.max(1000, Number(batchCharLimitStr ?? 12000));

    const entries = await expandInputs(inputsRaw, excludedRaw);
    const jsonEntries = entries.filter((e) => e.absPath.toLowerCase().endsWith(".json"));

    if (jsonEntries.length === 0) {
        console.log("No JSON files found.");
        process.exit(0);
    }

    await fs.ensureDir(outputDir);

    console.log(`Model: ${modelName}`);
    console.log(`Target language: ${targetLang}`);
    if (sourceLang) console.log(`Source language: ${sourceLang}`);
    console.log(`Output dir: ${outputDir}`);
    console.log(`Files: ${jsonEntries.length}`);
    console.log(`Force retranslate: ${forceRetranslate ? 'Yes' : 'No'}`);

    const includeRegexes = keysRegex.map(parseRegex);
    const excludeRegexes = excludeKeysRegex.map(parseRegex);

    let ok = 0;
    let skip = 0;
    let fail = 0;

    for (const entry of jsonEntries) {
        const src = entry.absPath;
        const rel = entry.relFromBase;
        const dest = path.join(outputDir, rel);

        try {
            const raw = await fs.readFile(src, "utf8");
            let sourceData: ChromeI18nFile;
            try {
                sourceData = JSON.parse(raw);
            } catch (err) {
                throw new Error(`Invalid JSON: ${(err as Error).message}`);
            }

            // Load existing translation file if it exists
            let existingData: ChromeI18nFile = {};
            const existingExists = await fs.pathExists(dest);
            if (existingExists) {
                try {
                    const existingRaw = await fs.readFile(dest, "utf8");
                    existingData = JSON.parse(existingRaw);
                    console.log(`📂  Loaded existing translations from ${prettyRel(dest)}`);
                } catch (err) {
                    console.warn(`⚠️   Could not parse existing file ${prettyRel(dest)}, will overwrite: ${(err as Error).message}`);
                    existingData = {};
                }
            }

            const sourceKeys = Object.keys(sourceData);
            const candidateKeys = selectKeys(sourceKeys, {
                includeExact: new Set(keysExact),
                includeRegex: includeRegexes,
                excludeExact: new Set(excludeKeysExact),
                excludeRegex: excludeRegexes,
            }).filter((k) => typeof sourceData[k]?.message === "string");

            // Filter out keys that already exist in target (unless force retranslate)
            const toTranslateKeys = candidateKeys.filter((k) => {
                if (forceRetranslate) return true;
                const existingEntry = existingData[k];
                return !existingEntry || !existingEntry.message || existingEntry.message.trim() === '';
            });

            const alreadyTranslatedKeys = candidateKeys.filter((k) => !toTranslateKeys.includes(k));

            if (toTranslateKeys.length === 0) {
                if (alreadyTranslatedKeys.length > 0) {
                    skip++;
                    console.log(`↷  (${alreadyTranslatedKeys.length} keys already translated) ${prettyRel(src)}`);
                } else {
                    skip++;
                    console.log(`↷  (no matching keys) ${prettyRel(src)}`);
                }

                if (!dryRun) {
                    // Merge source structure with existing translations
                    const mergedData = mergeTranslations(sourceData, existingData);
                    await fs.ensureDir(path.dirname(dest));
                    await fs.writeFile(dest, JSON.stringify(mergedData, null, 2) + "\n", "utf8");
                }
                continue;
            }

            const items = toTranslateKeys.map((key) => ({
                key,
                message: (sourceData[key].message ?? "") as string,
                description: (sourceData[key].description ?? "") as string,
            }));

            const batches = chunkByCharLimit(items, batchCharLimit);

            const newTranslations: Record<string, string> = {};

            if (dryRun) {
                console.log(`⋯  PLAN ${prettyRel(src)} → new keys: ${toTranslateKeys.length}, existing: ${alreadyTranslatedKeys.length}, batches: ${batches.length}`);
            } else {
                for (let i = 0; i < batches.length; i++) {
                    const batch = batches[i];
                    const map = await translateBatch({
                        batch,
                        file: path.basename(src),
                        targetLang,
                        sourceLang,
                        modelName,
                    });
                    Object.assign(newTranslations, map);
                    console.log(`✓  translated batch ${i + 1}/${batches.length} (${batch.length} keys) for ${prettyRel(src)}`);
                }
            }

            if (!dryRun) {
                // Merge source structure with existing translations and new translations
                const mergedData = mergeTranslations(sourceData, existingData, newTranslations);

                await fs.ensureDir(path.dirname(dest));
                await fs.writeFile(dest, JSON.stringify(mergedData, null, 2) + "\n", "utf8");
                ok++;
                console.log(`✅  ${prettyRel(src)} -> ${prettyRel(dest)} (${toTranslateKeys.length} new, ${alreadyTranslatedKeys.length} existing)`);
            }
        } catch (err: any) {
            fail++;
            console.error(`❌  ${prettyRel(src)}: ${err?.message || err}`);
        }
    }

    console.log(`\nDone. Success: ${ok}, Skipped: ${skip}, Failed: ${fail}`);
    if (fail > 0) process.exitCode = 1;
}

function mergeTranslations(
    sourceData: ChromeI18nFile,
    existingData: ChromeI18nFile,
    newTranslations?: Record<string, string>
): ChromeI18nFile {
    const merged: ChromeI18nFile = {};

    for (const key of Object.keys(sourceData)) {
        const sourceEntry = sourceData[key];
        const existingEntry = existingData[key];

        const mergedEntry: ChromeI18nEntry = { ...sourceEntry };

        if (newTranslations?.[key]) {
            mergedEntry.message = newTranslations[key];
        }
        else if (existingEntry?.message) {
            mergedEntry.message = existingEntry.message;
        }

        merged[key] = mergedEntry;
    }

    for (const key of Object.keys(existingData)) {
        if (!merged[key]) {
            merged[key] = { ...existingData[key] };
        }
    }

    return merged;
}

function prettyRel(abs: string) {
    return path.relative(process.cwd(), abs) || abs;
}

async function expandInputs(inputsRaw: string[], excludedRaw: string[]) {
    const patterns: string[] = [];
    const baseRoots: string[] = [];

    for (const item of inputsRaw) {
        const p = item.trim();
        const hasGlob = /[*?\[\]{}!]/.test(p);
        if (hasGlob) {
            patterns.push(p);
            baseRoots.push(globParent(p));
        } else {
            const stat = await fs.stat(p).catch(() => undefined);
            if (!stat) {
                console.error(`Input not found: ${p}`);
                continue;
            }
            if (stat.isDirectory()) {
                patterns.push(path.join(p, "**/*.json"));
                baseRoots.push(p);
            } else if (stat.isFile()) {
                patterns.push(p);
                baseRoots.push(path.dirname(p));
            }
        }
    }

    const uniqueFiles = new Set<string>();
    for (const pat of patterns) {
        const files = await fg(pat, {
            onlyFiles: true,
            dot: true,
            unique: true,
            ignore: excludedRaw,
            followSymbolicLinks: true,
            extglob: true,
        });
        for (const f of files) if (f.toLowerCase().endsWith(".json")) uniqueFiles.add(path.resolve(f));
    }

    const roots = baseRoots.map((r) => path.resolve(r));
    const entries = Array.from(uniqueFiles).map((absPath) => {
        const best =
            roots
                .filter((r) => absPath.startsWith(r + path.sep) || absPath === r)
                .sort((a, b) => b.length - a.length)[0] || process.cwd();
        const relFromBase = path.relative(best, absPath);
        return { absPath, baseRoot: best, relFromBase };
    });

    return entries;
}

function parseRegex(input: string): RegExp {
    const m = input.match(/^\/(.*)\/([a-z]*)$/i);
    if (m) return new RegExp(m[1], m[2]);
    return new RegExp(input);
}

function selectKeys(
    keys: string[],
    {
        includeExact,
        includeRegex,
        excludeExact,
        excludeRegex,
    }: {
        includeExact: Set<string>;
        includeRegex: RegExp[];
        excludeExact: Set<string>;
        excludeRegex: RegExp[];
    }
): string[] {
    const included = new Set<string>();

    if (includeExact.size === 0 && includeRegex.length === 0) {
        keys.forEach((k) => included.add(k));
    } else {
        for (const k of keys) {
            if (includeExact.has(k) || includeRegex.some((r) => r.test(k))) {
                included.add(k);
            }
        }
    }

    for (const k of Array.from(included)) {
        if (excludeExact.has(k) || excludeRegex.some((r) => r.test(k))) {
            included.delete(k);
        }
    }

    return Array.from(included);
}

function chunkByCharLimit<T extends { key: string; message: string; description?: string }>(
    items: T[],
    limit: number
): T[][] {
    const batches: T[][] = [];
    let current: T[] = [];
    let chars = 0;
    for (const it of items) {
        const add = (it.key.length + it.message.length + (it.description?.length ?? 0) + 32);
        if (chars + add > limit && current.length > 0) {
            batches.push(current);
            current = [];
            chars = 0;
        }
        current.push(it);
        chars += add;
    }
    if (current.length) batches.push(current);
    return batches;
}

async function translateBatch({
    batch,
    file,
    targetLang,
    sourceLang,
    modelName,
}: {
    batch: Array<{ key: string; message: string; description?: string }>;
    file: string;
    targetLang: string;
    sourceLang?: string | undefined;
    modelName: string;
}): Promise<Record<string, string>> {
    const system = `You are a professional software localization translator. Translate$${""}$
${sourceLang ? ` from ${sourceLang}` : ""} into ${targetLang}.
CRITICAL RULES:
- Only translate the \"message\" values provided. Use \"description\" only as context.
- Preserve placeholders and variables exactly: $NAME$, $1, $2, {name}, {count}, {count, plural, ...}, %s, %d, {{mustache}}, <tags>, \n, \t.
- Do NOT translate URLs, file paths, code identifiers, HTML tags, or anything inside backticks.
- Keep punctuation and spacing natural for the target language.
- Return ONLY a valid JSON object that maps each input key to its translated string. No trailing commas, no comments, no extra fields.
- Do not add or remove keys. Do not wrap values in extra quotes.
- IMPORTANT: Output JSON only.`.replace("$", "");

    const prompt = JSON.stringify(
        {
            file,
            items: batch.map((b) => ({ key: b.key, message: b.message, description: b.description ?? "" })),
            outputShape: "{ [key: string]: translatedMessage }",
        },
        null,
        2
    );

    const { text } = await generateText({
        model: google(modelName),
        system,
        prompt,
    });

    const parsed = safeParseJsonObject(text);
    if (!parsed) {
        const extracted = extractFirstJsonObject(text);
        if (!extracted) {
            throw new Error("Model did not return valid JSON");
        }
        const parsed2 = safeParseJsonObject(extracted);
        if (!parsed2) throw new Error("Failed to parse JSON from model output");
        return parsed2;
    }
    return parsed;
}

function safeParseJsonObject(text: string): Record<string, string> | null {
    try {
        const obj = JSON.parse(text);
        if (obj && typeof obj === "object" && !Array.isArray(obj)) {
            const out: Record<string, string> = {};
            for (const [k, v] of Object.entries(obj)) {
                if (v === null || v === undefined) continue;
                out[k] = String(v);
            }
            return out;
        }
        return null;
    } catch {
        return null;
    }
}

function extractFirstJsonObject(text: string): string | null {
    const start = text.indexOf("{");
    if (start === -1) return null;
    let depth = 0;
    for (let i = start; i < text.length; i++) {
        const ch = text[i];
        if (ch === "{") depth++;
        else if (ch === "}") {
            depth--;
            if (depth === 0) {
                return text.slice(start, i + 1);
            }
        }
    }
    return null;
}

run(binary(cmd), process.argv);

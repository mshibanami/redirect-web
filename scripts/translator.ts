// CLI Translator using Vercel AI SDK + Google Gemini
// ---------------------------------------------------
// 
// Usage examples:
// npx tsx translator.ts \
// --input "docs/**/*.md" src/notes \
// --excluded-input "**/node_modules/**" \
// --excluded-input "**/*.min.*" \
// --input-extensions .md,.txt,.srt \
// --output-dir translated-ja \
// --target-lang ja \
// --source-lang en

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
} from "cmd-ts";

const cmd = command({
    name: "translator",
    description: "Batch translate files with Gemini",
    args: {
        inputsRaw: multioption({
            long: "input",
            type: array(string),
            description: "Input glob(s). Repeatable.",
        }),
        excludedRaw: multioption({
            long: "excluded-input",
            type: array(string),
            description: "Exclude glob(s). Repeatable.",
        }),
        inputExtensionsCsv: option({
            long: "input-extensions",
            type: optional(string),
            description: "Comma-separated extensions (e.g., md,mdx,txt)",
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
    },

    handler: async (args) => {
        await main(args);
    },
});

async function main({
    inputsRaw,
    excludedRaw,
    inputExtensionsCsv,
    outputDir,
    targetLang,
    sourceLang,
    modelName,
}: {
    inputsRaw: string[];
    excludedRaw: string[];
    inputExtensionsCsv?: string | undefined;
    outputDir: string;
    targetLang: string;
    sourceLang?: string | undefined;
    modelName: string;
}) {
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
        console.error("Error: GOOGLE_GENERATIVE_AI_API_KEY is not set.");
        process.exit(1);
    }
    if (inputsRaw.length === 0) {
        console.error("Error: at least one --input is required.");
        process.exit(1);
    }
    // normalize extensions
    const wantedExts = (inputExtensionsCsv ? inputExtensionsCsv.split(/[,\s]+/).filter(Boolean) : [])
        .map((e) => (e.startsWith(".") ? e.toLowerCase() : `.${e.toLowerCase()}`));

    const defaultBinaryExts = new Set([
        ".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg", ".avif",
        ".pdf", ".zip", ".gz", ".tgz", ".rar",
        ".mp3", ".wav", ".flac", ".mp4", ".mov", ".avi",
        ".exe", ".dll", ".so", ".dylib",
    ]);

    const expandInputs = async () => {
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
                    patterns.push(path.join(p, "**/*"));
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
            });
            for (const f of files) uniqueFiles.add(path.resolve(f));
        }

        const roots = baseRoots.map((r) => path.resolve(r));
        const entries = Array.from(uniqueFiles).map((absPath) => {
            const best = roots
                .filter((r) => absPath.startsWith(r + path.sep) || absPath === r)
                .sort((a, b) => b.length - a.length)[0] || process.cwd();
            const rel = path.relative(best, absPath);
            return { absPath, baseRoot: best, relFromBase: rel };
        });

        return entries;
    }

    const shouldKeepByExt = ({ file }: { file: string; }) => {
        const ext = path.extname(file).toLowerCase();
        if (wantedExts.length > 0) {
            return wantedExts.includes(ext);
        }
        return !defaultBinaryExts.has(ext);
    }

    const translateText = async (text: string, meta: { file: string }) => {
        const system = `You are a professional translator. Translate${sourceLang ? ` from ${sourceLang}` : ""} into ${targetLang}.
- Preserve original formatting, markup, whitespace, punctuation, and file structure.
- Do NOT translate code syntax, variable names, file paths, HTML tags, Markdown link URLs, code blocks, or inline code (backticks).
- Translate only natural language content and comments.
- Maintain placeholders like {like_this}, %s, {{mustache}}, <tags>, and \\n escapes.
- If the text is already mostly ${targetLang}, lightly edit for fluency but avoid changing technical terms.
- Respond with ONLY the translated content inside the "<CONTENT>" tags (= without the tags); do not add explanations.`;

        const prompt = `File: ${meta.file}\n\n<CONTENT>\n${text}\n</CONTENT>`;
        const { text: out } = await generateText({
            model: google(modelName),
            system,
            prompt,
        });
        return out;
    }

    const entries = await expandInputs();
    const toProcess = entries.filter((e) => shouldKeepByExt({ file: e.absPath }));

    if (toProcess.length === 0) {
        console.log("No files matched your criteria.");
        process.exit(0);
    }

    await fs.ensureDir(outputDir);

    console.log(`Model: ${modelName}`);
    console.log(`Target language: ${targetLang}`);
    if (sourceLang) {
        console.log(`Source language: ${sourceLang}`);
    }
    console.log(`Output dir: ${outputDir}`);
    console.log(`Files: ${toProcess.length}`);

    let ok = 0, fail = 0;

    for (const entry of toProcess) {
        const src = entry.absPath;
        const rel = entry.relFromBase;
        const dest = path.join(outputDir, rel);

        try {
            await fs.ensureDir(path.dirname(dest));
            const raw = await fs.readFile(src, "utf8");
            const translated = await translateText(raw, { file: path.basename(src) });
            await fs.writeFile(dest, translated, "utf8");
            ok++;
            console.log(`✅️ ${path.relative(process.cwd(), src)} -> ${path.relative(process.cwd(), dest)}`);
        } catch (err: any) {
            fail++;
            console.error(`❌️ ${src}: ${err?.message || err}`);
        }
    }

    console.log(`\nDone. Success: ${ok}, Failed: ${fail}`);
    if (fail > 0) {
        process.exitCode = 1;
    }
}

run(binary(cmd), process.argv);

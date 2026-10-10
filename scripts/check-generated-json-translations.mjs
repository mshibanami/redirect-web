import { existsSync } from 'node:fs';
import { parseArgs } from './lib/cli.mjs';
import { resolveTargetLocales } from './lib/locales.mjs';
import { fromRoot, readJson } from './lib/project.mjs';
import { TRANSLATION_TARGETS } from './lib/translation-targets.mjs';

const args = parseArgs({
  usage: `Usage: pnpm run check-generated-json-translations [options]

Options:
  --target-langs <lang...>   Languages to check (default: all)`,
  options: { 'target-langs': 'list' },
});

const locales = await resolveTargetLocales(args['target-langs']);
const targets = [TRANSLATION_TARGETS.library, TRANSLATION_TARGETS.json];
for (const target of targets) {
  await target.prepare?.();
}

let problemCount = 0;
for (const locale of locales) {
  console.log(`[${locale}] Checking translations ...`);
  for (const target of targets) {
    for (const source of target.listSources()) {
      const translated = target.targetPath(source, locale);
      for (const problem of findProblems(source, translated)) {
        console.log(`${translated}: ❌️ ${problem}`);
        problemCount++;
      }
    }
  }
  console.log();
}

if (problemCount > 0) {
  console.error(`Found ${problemCount} problems.`);
  process.exit(1);
}
console.log('No problems found.');

function findProblems(source, translated) {
  if (!existsSync(fromRoot(translated))) {
    return ['File does not exist.'];
  }
  let translatedKeys;
  try {
    translatedKeys = keyPaths(readJson(translated));
  } catch (error) {
    return [`Parse error: ${error.message}`];
  }
  const sourceKeys = keyPaths(readJson(source));

  const missing = [...sourceKeys].filter((key) => !translatedKeys.has(key));
  const unexpected = [...translatedKeys].filter((key) => !sourceKeys.has(key));
  return [
    ...(missing.length > 0 ? [`Missing keys:\n${toList(missing)}`] : []),
    ...(unexpected.length > 0 ? [`Unexpected keys:\n${toList(unexpected)}`] : []),
  ];
}

function keyPaths(value, prefix = '', paths = new Set()) {
  if (value !== null && typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) {
      const childPath = prefix ? `${prefix}.${key}` : key;
      paths.add(childPath);
      keyPaths(child, childPath, paths);
    }
  }
  return paths;
}

function toList(keys) {
  return keys.map((key) => `  - ${key}`).join('\n');
}

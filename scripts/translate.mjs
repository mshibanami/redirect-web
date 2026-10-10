import { existsSync } from 'node:fs';
import path from 'node:path';
import { ask, fail, isInteractive, mapWithConcurrency, parseArgs, run } from './lib/cli.mjs';
import { resolveTargetLocales } from './lib/locales.mjs';
import { fromRoot } from './lib/project.mjs';
import { TRANSLATION_TARGETS } from './lib/translation-targets.mjs';

const DEFAULT_MODEL = 'Gemini 3.8 Flash (Low)';
const MAX_PARALLEL_AGENTS = 3;

const [targetName, ...argv] = process.argv.slice(2);
const target = TRANSLATION_TARGETS[targetName];
if (!target) {
  fail(
    `Usage: node scripts/translate.mjs <${Object.keys(TRANSLATION_TARGETS).join('|')}> [options]`,
  );
}
const { selection } = target;

const args = parseArgs({
  argv,
  usage: `Usage: pnpm run translate-${targetName} [options]

Options:
  --target-langs <lang...>   Languages to translate into (default: ask, or all)
  --${`${selection.option} <value...>`.padEnd(24)} The ${selection.label} to translate (default: ask, or all)
  --overwrite                Retranslate the files that are already translated
  --skip-existing            Skip the files that are already translated
  --model <name>             The model of agy (default: "${DEFAULT_MODEL}")`,
  options: {
    'target-langs': 'list',
    [selection.option]: 'list',
    overwrite: 'boolean',
    'skip-existing': 'boolean',
    model: 'string',
  },
});
if (args.overwrite && args['skip-existing']) {
  fail('--overwrite and --skip-existing cannot be used together.');
}

await target.prepare?.();
const locales = await resolveTargetLocales(args['target-langs'], { prompt: true });
const sources = await resolveSources();
const jobs = await planJobs(await resolveOverwritePolicy());

const failedLocales = [];
await mapWithConcurrency(jobs, MAX_PARALLEL_AGENTS, async ({ locale, sources }) => {
  console.log(`[${locale}] Starting translation (${sources.length} files)`);
  const code = await runAgent(
    `Finish the task described in \`${fromRoot(target.promptFile)}\`. ` +
      `Target language: ${locale}. ${target.describeSources(sources)}`,
  );
  if (code === 0) {
    console.log(`[${locale}] Finished translation`);
  } else {
    console.error(`[${locale}] agy exited with code ${code}`);
    failedLocales.push(locale);
  }
});

if (failedLocales.length > 0) {
  fail(`Translation failed for: ${failedLocales.join(' ')}`);
}

async function resolveSources() {
  let values = args[selection.option];
  if (!values && isInteractive) {
    const answer = await ask(
      `Enter ${selection.label} to translate (space-separated, or press Enter for all): `,
    );
    values = answer ? answer.split(/[\s,]+/) : undefined;
  }
  const sources = values ? [...new Set(target.selectSources(values))] : target.listSources();
  if (sources.length === 0) {
    fail('No source files found.');
  }
  return sources;
}

async function resolveOverwritePolicy() {
  if (args.overwrite) {
    return 'overwrite';
  }
  if (args['skip-existing'] || !isInteractive) {
    return 'skip';
  }
  const answer = await ask(
    'Overwrite existing files? [ask (default, confirm each) / skip (skip all) / overwrite (overwrite all)]: ',
  );
  return ['skip', 'overwrite'].includes(answer) ? answer : 'ask';
}

async function planJobs(overwritePolicy) {
  const jobs = [];
  for (const locale of locales) {
    const sourcesToTranslate = [];
    for (const source of sources) {
      const translated = target.targetPath(source, locale);
      if (overwritePolicy !== 'overwrite' && existsSync(fromRoot(translated))) {
        if (overwritePolicy === 'skip') {
          continue;
        }
        const answer = await ask(
          `[${locale}] ${translated} already exists. Overwrite? [y/N/all/none]: `,
        );
        if (answer === 'all') {
          overwritePolicy = 'overwrite';
        } else if (answer === 'none') {
          overwritePolicy = 'skip';
          continue;
        } else if (answer.toLowerCase() !== 'y') {
          continue;
        }
      }
      sourcesToTranslate.push(source);
    }

    if (sourcesToTranslate.length > 0) {
      jobs.push({ locale, sources: sourcesToTranslate });
    } else {
      console.log(`[${locale}] No files to translate. Skipping...`);
    }
  }
  return jobs;
}

async function runAgent(prompt) {
  try {
    return await run(
      'agy',
      [
        ...['--model', args.model ?? DEFAULT_MODEL],
        '--dangerously-skip-permissions',
        ...['--output-format', 'text'],
        ...['--prompt', prompt],
      ],
      { stdio: ['ignore', 'inherit', 'inherit'] },
    );
  } catch (error) {
    if (error.code === 'ENOENT') {
      fail('The `agy` command is not found. Install it and sign in first.');
    }
    throw error;
  }
}

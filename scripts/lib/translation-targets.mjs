import { existsSync } from 'node:fs';
import path from 'node:path';
import fg from 'fast-glob';
import { fail } from './cli.mjs';
import { extractLibraryMessages, listRuleIds, ruleMessagesPath } from './library.mjs';
import { BASE_LOCALE } from './locales.mjs';
import { ROOT, fromRoot } from './project.mjs';

const DOCS_DIR = 'docs';
const SITE_JSON_DIR = `i18n/${BASE_LOCALE}`;

function glob(pattern, options) {
  return fg.sync(pattern, { cwd: ROOT, ...options }).sort();
}

function resolveSourceFiles(files, sourceDir) {
  return files.map((file) => {
    const found = [fromRoot(file), fromRoot(sourceDir, file)]
      .map((candidate) => path.relative(ROOT, candidate).replaceAll(path.sep, '/'))
      .find(
        (candidate) => candidate.startsWith(`${sourceDir}/`) && existsSync(fromRoot(candidate)),
      );
    return found ?? fail(`Source file not found in ${sourceDir}/: ${file}`);
  });
}

function ruleIdOf(messagesPath) {
  return messagesPath.split('/')[2];
}

export const TRANSLATION_TARGETS = {
  docs: {
    promptFile: 'prompts/translate-docs.md',
    selection: { option: 'source-files', label: 'source files' },
    listSources: () =>
      glob(`${DOCS_DIR}/**/*.{md,mdx}`, {
        ignore: [`${DOCS_DIR}/privacy-policy.mdx`, `${DOCS_DIR}/terms-of-use.mdx`],
      }),
    selectSources: (files) => resolveSourceFiles(files, DOCS_DIR),
    targetPath: (source, locale) =>
      path.posix.join(
        'i18n',
        locale,
        'docusaurus-plugin-content-docs/current',
        path.posix.relative(DOCS_DIR, source),
      ),
    describeSources: (sources) => `Source files: ${sources.join(' ')}`,
  },

  json: {
    promptFile: 'prompts/translate-i18n-json-files.md',
    selection: { option: 'source-files', label: 'source JSON files' },
    listSources: () => glob(`${SITE_JSON_DIR}/**/*.json`),
    selectSources: (files) => resolveSourceFiles(files, SITE_JSON_DIR),
    targetPath: (source, locale) =>
      path.posix.join('i18n', locale, path.posix.relative(SITE_JSON_DIR, source)),
    describeSources: (sources) => `Source files: ${sources.join(' ')}`,
  },

  library: {
    promptFile: 'prompts/translate-library-i18n-messages-json.md',
    selection: { option: 'rule-ids', label: 'rule IDs' },
    prepare: () => extractLibraryMessages(),
    listSources: () => listRuleIds().map((ruleId) => ruleMessagesPath(ruleId, BASE_LOCALE)),
    selectSources: (values) => {
      const ruleIds = listRuleIds();
      return values.flatMap((value) => {
        const matched = ruleIds.filter((id) => id === value || id.split('_')[0] === value);
        if (matched.length === 0) {
          fail(`Unknown rule ID: ${value}`);
        }
        return matched.map((ruleId) => ruleMessagesPath(ruleId, BASE_LOCALE));
      });
    },
    targetPath: (source, locale) => ruleMessagesPath(ruleIdOf(source), locale),
    describeSources: (sources) => `Rule IDs: ${sources.map(ruleIdOf).join(' ')}`,
  },
};

import { existsSync, readdirSync } from 'node:fs';
import { fromRoot, readJson, writeJson } from './project.mjs';

const RULE_SETS_DIR = 'library/rule-sets';

const METADATA_KEYS = ['title', 'description'];
const REDIRECT_KEYS = ['title', 'comments'];

export function ruleMessagesPath(ruleId, locale) {
  return `${RULE_SETS_DIR}/${ruleId}/i18n/${locale}/messages.json`;
}

export function listRuleIds() {
  return readdirSync(fromRoot(RULE_SETS_DIR), { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((id) => !id.startsWith('.') && !id.includes('DELETED') && !id.includes('HIDDEN'))
    .filter((id) => existsSync(fromRoot(RULE_SETS_DIR, id, 'rule-set.json')))
    .sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));
}

function pickMessages(source, keys, toEntry) {
  return Object.entries(source ?? {})
    .filter(([key]) => keys.includes(key))
    .map(([key, message]) => toEntry(key, message));
}

function extractRuleMessages(ruleId) {
  const metadataPath = `${RULE_SETS_DIR}/${ruleId}/metadata.json`;
  const metadata = existsSync(fromRoot(metadataPath)) ? readJson(metadataPath) : {};
  const ruleSet = readJson(`${RULE_SETS_DIR}/${ruleId}/rule-set.json`);

  const entries = [
    ...pickMessages(metadata, METADATA_KEYS, (key, message) => [
      `metadata.json#/${key}`,
      { message, description: `The ${key} of the rule set in metadata.json` },
    ]),
    ...(ruleSet.redirects ?? []).flatMap((redirect, index) =>
      pickMessages(redirect, REDIRECT_KEYS, (key, message) => [
        `rule-set.json#/redirects/${index}/${key}`,
        { message, description: `The ${key} of redirect rule #${index}` },
      ]),
    ),
  ];
  return Object.fromEntries(entries.sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)));
}

export function extractLibraryMessages({ preserveDescriptions = false } = {}) {
  return listRuleIds().map((ruleId) => {
    const messagesPath = ruleMessagesPath(ruleId, 'en');
    const messages = extractRuleMessages(ruleId);

    if (preserveDescriptions && existsSync(fromRoot(messagesPath))) {
      const existing = readJson(messagesPath);
      for (const [key, entry] of Object.entries(messages)) {
        entry.description = existing[key]?.description || entry.description;
      }
    }

    writeJson(messagesPath, messages);
    return messagesPath;
  });
}

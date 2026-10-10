import { readFileSync } from 'node:fs';
import { ask, fail, isInteractive } from './cli.mjs';
import { fromRoot } from './project.mjs';

export const BASE_LOCALE = 'en';
export const TARGET_LOCALES = readSupportedLocales().filter((locale) => locale !== BASE_LOCALE);

function readSupportedLocales() {
  const file = 'src/constants.ts';
  const [, list] =
    readFileSync(fromRoot(file), 'utf8').match(/SUPPORTED_LOCALES = \[(.*?)\]/s) ?? [];
  const locales = [...(list ?? '').matchAll(/'([^']+)'/g)].map(([, locale]) => locale);
  if (locales.length === 0) {
    throw new Error(`Failed to read SUPPORTED_LOCALES from ${file}`);
  }
  return locales;
}

export async function resolveTargetLocales(requested, { prompt = false } = {}) {
  let locales = requested;
  if (!locales && prompt && isInteractive) {
    console.log(`Available languages: ${TARGET_LOCALES.join(' ')}`);
    const answer = await ask('Enter target languages (space-separated, or press Enter for all): ');
    locales = answer ? answer.split(/[\s,]+/) : undefined;
  }
  locales ??= TARGET_LOCALES;

  const unknown = locales.filter((locale) => !TARGET_LOCALES.includes(locale));
  if (unknown.length > 0) {
    fail(`Unknown target languages: ${unknown.join(' ')}\nAvailable: ${TARGET_LOCALES.join(' ')}`);
  }
  return [...new Set(locales)];
}

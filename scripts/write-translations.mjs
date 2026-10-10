import { runOrExit } from './lib/cli.mjs';
import { readJson, writeJson } from './lib/project.mjs';

const IGNORED_KEYS = {
  'i18n/en/code.json': [/^theme\./],
  'i18n/en/docusaurus-plugin-content-docs/current.json': [/^version\.label$/],
  'i18n/en/docusaurus-theme-classic/navbar.json': [/^title$/],
  'i18n/en/docusaurus-theme-classic/footer.json': [
    /^copyright$/,
    /^link\.item\.label\.LinkedIn$/,
    /^link\.item\.label\.App Store$/,
    /^link\.item\.label\.GitHub$/,
  ],
};

await runOrExit('pnpm', ['exec', 'docusaurus', 'write-translations', '--override']);

for (const [file, patterns] of Object.entries(IGNORED_KEYS)) {
  const messages = Object.entries(readJson(file)).filter(
    ([key]) => !patterns.some((pattern) => pattern.test(key)),
  );
  writeJson(file, Object.fromEntries(messages));
}

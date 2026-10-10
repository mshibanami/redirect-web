import { cpSync, rmSync } from 'node:fs';
import { fail, parseArgs, runOrExit } from './lib/cli.mjs';
import { fromRoot } from './lib/project.mjs';

const ENVIRONMENTS = {
  github: {
    BASE_SITE_URL: 'https://mshibanami.github.io',
    BASE_PATH: '/redirect-web/',
    REDIRECTION_BASE_URL: 'https://redirectweb.net',
  },
  cloudflare: {
    BASE_SITE_URL: 'https://redirectweb.net',
    BASE_PATH: '/',
    REDIRECTION_BASE_URL: '',
  },
};

const usage = `Usage: node scripts/build-prod.mjs --environment <${Object.keys(ENVIRONMENTS).join('|')}>`;
const { environment } = parseArgs({ usage, options: { environment: 'string' } });
const env = ENVIRONMENTS[environment];
if (!env) {
  fail(`Unknown environment: ${environment}\n\n${usage}`);
}

rmSync(fromRoot('build'), { recursive: true, force: true });
rmSync(fromRoot('.docusaurus'), { recursive: true, force: true });

await runOrExit('pnpm', ['run', 'build'], { env: { ...process.env, ...env } });

cpSync(fromRoot('library'), fromRoot('build/library'), { recursive: true });

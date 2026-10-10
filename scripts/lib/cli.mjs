import { spawn } from 'node:child_process';
import { createInterface } from 'node:readline/promises';
import { ROOT } from './project.mjs';

export const isInteractive = Boolean(process.stdin.isTTY && process.stdout.isTTY);

export function fail(message) {
  console.error(message);
  process.exit(1);
}

export function parseArgs({ usage, options, argv = process.argv.slice(2) }) {
  const failWithUsage = (message) => fail(`${message}\n\n${usage}`);
  const parsed = {};

  let index = 0;
  while (index < argv.length) {
    const arg = argv[index++];
    if (arg === '--') {
      continue;
    }
    if (arg === '--help' || arg === '-h') {
      console.log(usage);
      process.exit(0);
    }
    if (!arg.startsWith('--')) {
      failWithUsage(`Unexpected argument: ${arg}`);
    }

    const [name, inlineValue] = arg.slice(2).split(/=(.*)/s);
    const type = options[name];
    if (!type) {
      failWithUsage(`Unknown option: --${name}`);
    }
    if (type === 'boolean') {
      parsed[name] = true;
      continue;
    }

    const values = inlineValue === undefined ? [] : [inlineValue];
    if (inlineValue === undefined) {
      const maxValues = type === 'list' ? Infinity : 1;
      while (index < argv.length && values.length < maxValues && !argv[index].startsWith('--')) {
        values.push(argv[index++]);
      }
    }
    if (values.length === 0) {
      failWithUsage(`Option --${name} requires a value.`);
    }
    if (type === 'list') {
      const items = values.flatMap((value) => value.split(',')).filter(Boolean);
      parsed[name] = [...(parsed[name] ?? []), ...items];
    } else {
      parsed[name] = values[0];
    }
  }
  return parsed;
}

export async function ask(question) {
  const readline = createInterface({ input: process.stdin, output: process.stdout });
  try {
    return (await readline.question(question)).trim();
  } finally {
    readline.close();
  }
}

export function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: ROOT,
      stdio: 'inherit',
      shell: process.platform === 'win32' && command === 'pnpm',
      ...options,
    });
    child.on('error', reject);
    child.on('close', (code) => resolve(code ?? 1));
  });
}

export async function runOrExit(command, args, options) {
  const code = await run(command, args, options);
  if (code !== 0) {
    process.exit(code);
  }
}

export async function mapWithConcurrency(items, limit, task) {
  const results = new Array(items.length);
  let next = 0;
  const worker = async () => {
    while (next < items.length) {
      const index = next++;
      results[index] = await task(items[index], index);
    }
  };
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

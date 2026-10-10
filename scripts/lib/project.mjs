import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = fileURLToPath(new URL('../..', import.meta.url));

export function fromRoot(...segments) {
  return path.resolve(ROOT, ...segments);
}

export function readJson(relativePath) {
  return JSON.parse(readFileSync(fromRoot(relativePath), 'utf8'));
}

export function writeJson(relativePath, value) {
  const filePath = fromRoot(relativePath);
  mkdirSync(path.dirname(filePath), { recursive: true });
  writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

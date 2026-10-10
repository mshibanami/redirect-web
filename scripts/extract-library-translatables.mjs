import { parseArgs } from './lib/cli.mjs';
import { extractLibraryMessages } from './lib/library.mjs';

const args = parseArgs({
  usage: `Usage: pnpm run extract-library-translatables [options]

Options:
  --preserve-existing-description   Keep the descriptions in the existing messages.json files`,
  options: { 'preserve-existing-description': 'boolean' },
});

const files = extractLibraryMessages({
  preserveDescriptions: Boolean(args['preserve-existing-description']),
});
for (const file of files) {
  console.log(`Created ${file}`);
}

import fs from 'node:fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/*
 * Run findCommonLines.ts to see the list of the commonly used lines that you
 * want to exclude
 */
export const removalList: ReadonlySet<string> = new Set(
  fs
    .readFileSync(join(__dirname, 'exclude-list.txt'), 'utf-8')
    .toString()
    .split('\n')
);

export const regexRemovalList = [
  /^Last modified on [^\n]+$/u,
  /^Cover image for [^\n]+$/u,
];
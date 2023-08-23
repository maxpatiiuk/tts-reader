import { program } from 'commander';
import fs from 'node:fs';

import { fetchInput, fileExists, timeIt } from './helpers.js';
import { reshapeText } from './reshaper.js';
import { formatNumber } from './utils.js';
import { f } from './functools.js';
import { retrieveSizeLimit, splitFile } from './splitFile.js';
import { countLines } from './countLines.js';

program
  .name('TTS Reader')
  .description(
    'Convert web articles into `.mp3` files that you can listen to at your own convenience'
  );

program
  .requiredOption('-i, --input <path>', 'location of the input file')
  .option('-o, --output <path>', 'location of the processed text file')
  .option(
    '-c, --countPath <path>',
    'count repeated lines and output a .tsv summary to this file'
  )
  .option(
    '-s, --split <number>',
    'Split input beyond this number of characters. Pass 0 to disable splitting. Default comes from `getconf ARG_MAX`'
  )
  .option(
    '-f, --force',
    'overwrite output file even if it already exists',
    false
  );

program.parse();

const {
  input,
  output,
  countPath,
  split: rawSplit,
  force,
} = program.opts<{
  readonly input: string;
  readonly output?: string;
  readonly countPath?: string;
  readonly force: boolean;
  readonly split?: string;
}>();

timeIt(run(input, output, countPath)).catch(console.error);

async function run(
  path: string,
  output?: string,
  countPath?: string
): Promise<void> {
  if (!force && typeof output === 'string' && (await fileExists(output)))
    throw new Error('Output file already exists');

  console.log('Fetching the source file');
  const rawText = await fetchInput(path);

  if (typeof countPath === 'string')
    await fs.promises.writeFile(
      countPath,
      countLines(reshapeText(rawText, false).split('\n'))
    );
  if (output === undefined) return;

  console.log('Reshaping the text');
  const text = reshapeText(rawText, true);

  // Don't count empty lines
  const oldLines = formatNumber(rawText.split('\n').length);
  const oldNonBlankLines = formatNumber(
    rawText.split('\n').filter(Boolean).length
  );
  const newLines = formatNumber(text.split('\n').length);
  console.log(
    `Reduced the number of lines from ${oldLines} (${oldNonBlankLines} non-blank) down to ${newLines}`
  );

  const split = Math.max(
    0,
    f.parseInt(rawSplit) ?? (await retrieveSizeLimit())
  );

  const splitText =
    split === 0 ? [[output, text]] : splitFile(output, text, split);

  await Promise.all(
    splitText.map(([fileName, text]) => fs.promises.writeFile(fileName, text))
  );
}
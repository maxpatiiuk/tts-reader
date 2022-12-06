import { program } from 'commander';
import fs from 'node:fs';

import { fetchInput, fileExists, timeIt } from './helpers.js';
import { reshapeText } from './reshaper.js';
import { formatNumber } from './utils.js';

program
  .name('TTS Reader')
  .description(
    'Convert news articles into `.mp3` files that you can listen to at your own convenience'
  );

program
  .requiredOption('-i, --input <path>', 'location of the input file')
  .requiredOption('-o, --output <path>', 'location of the processed text file')
  .option(
    '-f, --force',
    'overwrite output file even if it already exists',
    false
  );

program.parse();

const { input, output, force } = program.opts<{
  readonly input: string;
  readonly output: string;
  readonly force: boolean;
}>();

timeIt(run(input, output)).catch(console.error);

async function run(path: string, output: string): Promise<void> {
  if (!force && (await fileExists(output)))
    throw new Error('Output file already exists');

  console.log('Fetching the source file');
  const rawText = await fetchInput(path);

  console.log('Reshaping the text');
  const text = reshapeText(rawText);

  const oldLines = formatNumber(rawText.split('\n').length);
  const newLines = formatNumber(text.split('\n').length);
  console.log(
    `Reduced the number of lines from ${oldLines} down to ${newLines}`
  );

  return fs.promises.writeFile(output, text);
}

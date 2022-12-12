import { exec } from 'node:child_process';

import { f } from './functools.js';
import { formatNumber } from './utils.js';

// 128KB
const defaultCommandLengthLimit = 128 * 1024;
const safetyMargin = 4048;
const safetyConfidence = 0.98;

/**
 * Fetch the max size of a single file. Limited by the max command length
 * supported by the terminal.
 *
 * See more: https://github.com/sanack/node-jq/issues/51#issuecomment-264648661
 */
export const retrieveSizeLimit = async (): Promise<number> =>
  new Promise<number>((resolve) =>
    exec('getconf ARG_MAX', (error, stdOut, stdError) => {
      if (error !== null) throw error;
      if (stdError.length > 0) throw new Error(stdError);
      const limit = f.parseInt(stdOut);
      if (limit === undefined)
        throw new Error(`Unable to parse as a number: ${stdOut}`);
      resolve(limit);
    })
  )
    .catch<number>((error) => {
      console.log(
        `Unable to retrieve command length limit. Proceeding with the default of ${formatNumber(
          defaultCommandLengthLimit
        )}B`
      );
      console.error(error.message);
      return defaultCommandLengthLimit;
    })
    .then((number) => number * safetyConfidence - safetyMargin);

function getUniqueFileName(fullName: string, index: string): string {
  const parts = fullName.split('.');
  const name = parts.slice(0, -1);
  const extension = parts.at(-1)!;
  return `${name.join('.')}_${index}.${extension}`;
}

export function splitFile(
  fileName: string,
  text: string,
  maxSize: number
): readonly (readonly [fileName: string, text: string])[] {
  const chunkCount = Math.ceil(text.length / maxSize);
  const digitLength = chunkCount.toString().length;

  const lines = text.split('\n');
  // eslint-disable-next-line functional/prefer-readonly-type
  const chunks: (readonly [fileName: string, text: string])[] = [];
  let currentChunk = '';
  const getNextFileName = (): string =>
    getUniqueFileName(
      fileName,
      // This ensures natural sort order when using wildcards in bash
      (chunks.length + 1).toString().padStart(digitLength, '0')
    );
  lines.forEach((line) => {
    if (currentChunk.length + line.length >= maxSize) {
      chunks.push([getNextFileName(), currentChunk]);
      currentChunk = '';
    }
    currentChunk += `${line}\n`;
  });
  chunks.push([getNextFileName(), currentChunk]);
  return chunks;
}

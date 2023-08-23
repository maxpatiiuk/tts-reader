import { stripHtml } from 'string-strip-html';

import { regexRemovalList, removalList } from './config.js';
import { f } from './functools.js';

/**
 * Run through several processing functions to prepare the text for TTS
 */
export const reshapeText = (rawText: string, removeRepeated: boolean): string =>
  [
    stripAllHtml,
    removeEmojis,
    removeBlockListed,
    perLineProcessing.bind(undefined, removeRepeated),
  ].reduce((text, process) => process(text), rawText);

const stripAllHtml = (text: string): string => stripHtml(text).result;

/**
 * Remove Emojis, control characters and other uncommon characters
 *
 * @see https://www.regular-expressions.info/unicode.html
 * @see https://www.compart.com/en/unicode/category
 */
const reEmoji =
  /[^\p{Letter}\p{Number}\p{Punctuation}\p{Separator}\s\p{Math_Symbol}\p{Currency_Symbol}`^]/gu;

const removeEmojis = (text: string): string => text.replace(reEmoji, '');

function removeBlockListed(text: string): string {
  return regexRemovalList.reduce(
    (text, regexBlockList) => text.replace(regexBlockList, ''),
    text
  );
}

const perLineProcessing = (removeRepeated: boolean, text: string): string =>
  removeNonTextLines(
    (removeRepeated ? removeRepeatedLines : f.id)(strip(text.split('\n')))
  )
    .filter((line) => !removalList.has(line))
    .join('\n');

// Trimming allows to detect more duplicate lines
const strip = (lines: ReadonlyArray<string>) =>
  lines.map((line) => line.trim());

const removeRepeatedLines = f.unique;

const textLineThreshold = 0.3;
const reText = /[\s".A-Za-z\-]+/gu;

/** If a line consists of less than 30% text characters, then it is removed */
const removeNonTextLines = (text: readonly string[]): readonly string[] =>
  text.filter(
    (line) =>
      line.length > 3 &&
      line.replaceAll(reText, '').length < line.length * textLineThreshold
  );

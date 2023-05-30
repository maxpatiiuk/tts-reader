import { stripHtml } from 'string-strip-html';

import { regexRemovalList, removalList } from './config.js';
import { f } from './functools.js';

/**
 * Run through several processing functions to prepare the text for TTS
 */
export const reshapeText = (rawText: string): string =>
  [stripAllHtml, removeEmojis, removeBlockListed, perLineProcessing].reduce(
    (text, process) => process(text),
    rawText
  );

const stripAllHtml = (text: string): string => stripHtml(text).result;

/* eslint-disable */
// From https://stackoverflow.com/a/49986645/8584605
const reEmoji = new RegExp(
  '[' +
    'U0001F600-U0001F64F' + // Emoticons
    'U0001F300-U0001F5FF' + // Symbols & pictographs
    'U0001F680-U0001F6FF' + // Transport & map symbols
    'U0001F1E0-U0001F1FF' + // Flags (iOS)
    ']+',
  'u'
);
/* eslint-enable */

const removeEmojis = (text: string): string => text.replace(reEmoji, '');

function removeBlockListed(text: string): string {
  return regexRemovalList.reduce(
    (text, regexBlockList) => text.replace(regexBlockList, ''),
    text
  );
}

const perLineProcessing = (text: string): string =>
  removeNonTextLines(removeRepeatedLines(strip(text.split('\n'))))
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

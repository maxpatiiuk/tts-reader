import { stripHtml } from "string-strip-html";

import { regexRemovalList, removalList } from "./config.js";
import { f } from "./functools.js";
import { escapeRegExp } from "./utils.js";

/**
 * Run though several processing functions to prepare the text for TTS
 */
export const reshapeText = (rawText: string): string =>
  [stripAllHtml, removeEmojis, perLineProcessing, removeBlockListed].reduce(
    (text, process) => process(text),
    rawText
  );

const stripAllHtml = (text: string): string => stripHtml(text).result;

/* eslint-disable */
// From https://stackoverflow.com/a/49986645/8584605
const reEmoji = new RegExp(
  "[" +
    "U0001F600-U0001F64F" + // Emoticons
    "U0001F300-U0001F5FF" + // Symbols & pictographs
    "U0001F680-U0001F6FF" + // Transport & map symbols
    "U0001F1E0-U0001F1FF" + // Flags (iOS)
    "]+",
  "u"
);
/* eslint-enable */

const removeEmojis = (text: string): string => text.replace(reEmoji, "");

function removeBlockListed(text: string): string {
  const processed = removalList.reduce(
    (text, blockListed) =>
      text.replace(new RegExp(`^${escapeRegExp(blockListed)}$`, "u"), ""),
    text
  );
  return regexRemovalList.reduce(
    (text, regexBlockList) => text.replace(regexBlockList, ""),
    processed
  );
}

const perLineProcessing = (text: string): string =>
  removeNonTextLines(removeRepeatedLines(text.split("\n"))).join("\n");

const removeRepeatedLines = f.unique;

const textLineThreshold = 0.3;
const reText = /[\s".A-Za-z\-]+/gu;

/** If a line consists of less than 30% text characters, then it is removed */
const removeNonTextLines = (text: readonly string[]): readonly string[] =>
  text.filter(
    (line) =>
      line.replaceAll(reText, "").length < line.length * textLineThreshold
  );

import { program } from "commander";
import fs from "node:fs";

import { f } from "./functools.js";
import { fetchInput, fileExists, textToSpeech, timeIt } from "./helpers.js";
import { reshapeText } from "./reshaper.js";
import { retrieveSizeLimit, splitFile } from "./splitFile.js";
import { formatNumber } from "./utils.js";
import { setFormat } from "./speaker.js";

program
  .name("TTS Reader")
  .description(
    "Convert news articles into `.mp3` files that you can listen to at your own convenience"
  );

const defaultSpeed = 1;

program
  .requiredOption("-i, --input <path>", "location of the input file")
  .requiredOption(
    "-o, --output <path>",
    "location of the output file. Could provide a '.txt' file for a text-only export"
  )
  .option(
    "-v, --voice <string>",
    "voice name. Run findVoice.ts to find your favorite voice"
  )
  .option("-s, --speed <number>", "speaking rate", defaultSpeed.toString())
  .option(
    "-l, --limit <number>",
    "max size of a file. If you get an e2big error, reduce this value"
  )
  .option(
    "-d, --data-format <string>",
    "output audio format. This influences audio quality and file size. For available options run `man say` in the terminal (aacf, flac, alac).",
    "aacf"
  )
  .option(
    "-f, --force",
    "overwrite output file even if it already exists",
    false
  );

program.parse();

const {
  input,
  output,
  force,
  speed: rawSpeed,
  voice,
  limit: rawLimit,
  dataFormat,
} = program.opts<{
  readonly input: string;
  readonly output: string;
  readonly force: boolean;
  readonly voice?: string;
  readonly speed: string;
  readonly limit?: string;
  readonly dataFormat: string;
}>();

const speed = f.parseInt(rawSpeed) ?? defaultSpeed;
const limit = f.parseInt(rawLimit);

setFormat(dataFormat);
timeIt(run(input, output)).catch(console.error);

async function run(path: string, output: string): Promise<void> {
  console.log("Fetching the source file");
  const rawText = await fetchInput(path);

  console.log("Reshaing the text");
  const text = reshapeText(rawText);

  const oldLines = formatNumber(rawText.split("\n").length);
  const newLines = formatNumber(text.split("\n").length);
  console.log(
    `Reduced the number of lines from ${oldLines} down to ${newLines}`
  );

  if (!force && (await fileExists(output)))
    throw new Error("Output file already exists");

  if (output.endsWith(".txt")) return fs.promises.writeFile(output, text);

  const resolvedFileLimit = limit ?? (await retrieveSizeLimit());
  console.log(`Max file size limit: ${formatNumber(resolvedFileLimit)}B`);

  console.log("Synthesizing speech (this can take a while)");
  const splitFiles = splitFile(output, text, resolvedFileLimit);
  let finished = 0;
  return Promise.all(
    splitFiles.map(async ([fileName, text]) =>
      textToSpeech(fileName, text, speed, voice).then(() => {
        finished += 1;
        console.log(`Progress: ${finished}/${splitFiles.length}`);
      })
    )
  ).then(() => undefined);
}

/**
 * If running this as "npm run find-voice" and need to pass arguments,
 * see https://stackoverflow.com/a/14404223/8584605
 */

import { program } from 'commander';
import { exec } from 'node:child_process';

import { f } from './functools.js';

program
  .name('Voice finder helper')
  .description('Find a suitable voice among installed system voices');

const defaultDelay = 100;
const defaultSpeed = 100;

program
  .option(
    '-t, --text <string>',
    'the test string to say',
    'Hi! This is a test voice.'
  )
  .option(
    '-l, --language <string>',
    'only include voices whose language begins with a given string'
  )
  .option(
    '-d, --delay <number>',
    'dalay between voices (in ms)',
    defaultDelay.toString()
  )
  .option(
    '-s, --speed <number>',
    'speed of the output ',
    defaultSpeed.toString()
  )
  .option(
    '--voices  <names...>',
    'list of voices to include (multiple space separated values are accepted)'
  );

program.parse();

const {
  text,
  language,
  delay: rawDelay,
  speed: rawSpeed,
  voices = [],
} = program.opts<{
  readonly text: string;
  readonly language?: string;
  readonly delay: string;
  readonly speed: string;
  readonly voices?: readonly string[];
}>();

const delay = f.parseInt(rawDelay) ?? defaultDelay;
const speed = f.parseInt(rawSpeed) ?? defaultSpeed;

exec('say -v "?"', (error, stdOut, stdError) => {
  // eslint-disable-next-line functional/no-throw-statement
  if (Boolean(error)) throw new Error(error?.toString());
  // eslint-disable-next-line functional/no-throw-statement
  else if (stdError.length > 0) throw new Error(stdError);
  else
    sayVoices(filterVoices(parseVoices(stdOut), language, voices), text).catch(
      console.error
    );
});

type Voices = readonly {
  readonly name: string;
  readonly language: string;
  readonly raw: string;
}[];

/** Parse raw output from `say` */
const parseVoices = (stdOut: string): Voices =>
  stdOut
    .trim()
    .split('\n')
    .map((line) => {
      // This may break on macOS update
      const [nameAndLanguage, _description] = line.split('#');
      const [name, language] = nameAndLanguage.split(/\s{2,}/u);
      return { name, language, raw: line };
    });

/** Filter out voices as per CLI arguments */
const filterVoices = (
  voices: Voices,
  languageFilter: string | undefined,
  toInclude: readonly string[]
): Voices =>
  languageFilter === undefined && toInclude.length === 0
    ? voices
    : voices.filter(
        ({ language, name }) =>
          (languageFilter !== undefined &&
            language.startsWith(languageFilter)) ||
          toInclude.includes(name)
      );

async function sayVoices(voices: Voices, text: string): Promise<void> {
  voices.forEach(({ name }) => console.log(name));
  // eslint-disable-next-line functional/no-loop-statement
  for (const { name, raw } of voices) {
    console.log(raw);
    // eslint-disable-next-line no-await-in-loop
    await new Promise((resolve) =>
      exec(
        `say "${text.replaceAll('"', '"')}" --voice ${name} --rate ${speed}`,
        (error, _stdout, stderr) => {
          if (error) throw new Error(error.message);
          if (stderr) throw new Error(stderr);
          resolve(undefined);
        }
      )
    );
    // eslint-disable-next-line no-await-in-loop
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
}

# TTS Reader

Convert news articles into `.mp3` files that you can listen to at your own
convenience.

The idea behind this tool is to have a TXT file where the user would put web
pages in read mode and other text-based information separated by `...` or other separation string you specify.

The script will read the data from the file, remove redundancy, adopt it for
TTS and covert it to `.mp3`

The project uses [say](https://www.npmjs.com/package/say) NPM package for
converting text to speech.

> NOTE: at present this project only works on macOS.

Previous implementations of the TTS Reader:
- [python_tts](https://github.com/maxxxxxdlp/python_tts/)
- [TTS King](https://github.com/maxxxxxdlp/tts_king/)

## Installation

Install dependencies: 

```sh
npm install
```

## Finding Voices

There is a helper script provided for finding the best voice.

To see available options, run it with `--help` argument:

```
npx ts-node-esm src/findVoice.ts --help
```

Example call:

```sh
npx ts-node-esm src/findVoice.ts --voices Ava Karen Samantha --speed 3 --text "Hi! Isn't it a nice day out there?"
```

## Running

To see available options, run the main script with `--help` argument:

```
npx ts-node-esm src/run.ts --help
```

Example call:

```sh
npx ts-node-esm src/run.ts --input ~/Downloads/notes.txt --output ./test.mp3 --voice Ava --speed 2
```

# TTS Reader

> Unlike on the `main` branch, the TTS Reader on this branch calls `say` for you
> so you don't have to run two separate commands. It also can split the input
> file into smaller chunks.
> 
> However, I found it way simpler to call these commands separately (plus that
> decouples the text reshaper from the macOS exclusive tts-engine). That's why
> the solution on the `main` branch is preferred.

Convert news articles into `.mp3` files that you can listen to at your own
convenience.

The idea behind this tool is to have a TXT file where the user would put web
pages in read mode and other text-based information separated by `...` or other separation string you specify.

The script will read the data from the file, remove redundancy, adapt it for
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
npx ts-node-esm src/run.ts --input ~/Downloads/notes.txt --output ./test.m4a --voice Ava --speed 2
```

To see which file formats and data formats are supported on your
system, run `say --file-format=\? --data-format=\?`

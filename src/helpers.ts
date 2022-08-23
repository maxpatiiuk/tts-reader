import fs from "node:fs";
import type { Say } from "say";
import { speaker } from "./speaker.js";

export async function timeIt(callback: Promise<void>): Promise<void> {
  const start = Date.now();
  await callback;
  const end = Date.now();
  const timePassed = Math.round((end - start) / 1000);
  console.log("Done!");
  console.log(`Total time: ${timePassed}s`);
}

export const fetchInput = async (path: string): Promise<string> =>
  fs.promises.readFile(path).then((buffer) => buffer.toString());

export async function fileExists(path: string): Promise<boolean> {
  try {
    await fs.promises.access(path);
    return true;
  } catch {
    return false;
  }
}

export const textToSpeech = async (
  outputPath: string,
  text: string,
  speed: number,
  voice?: string
): Promise<void> =>
  new Promise((resolve) =>
    (speaker as Say).export(text, voice, speed, outputPath, (error) => {
      if (Boolean(error)) throw new Error(error);
      else resolve();
    })
  );

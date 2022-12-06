import fs from 'node:fs';

export async function timeIt(callback: Promise<void>): Promise<void> {
  const start = Date.now();
  await callback;
  const end = Date.now();
  const timePassed = Math.round((end - start) / 1000);
  console.log('Done!');
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

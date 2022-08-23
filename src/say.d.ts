/**
 * The library has poor typing, thus I had to provide my own typing
 */

declare module "say" {
  type ErrorCallback = (err: string) => void;

  export class Say {
    constructor(platform: "darwin");

    public export(
      text: string,
      voice?: string,
      speed?: number,
      filePath?: string,
      callback?: ErrorCallback
    ): void;

    public speak(
      text: string,
      voice?: string,
      speed?: number,
      callback?: ErrorCallback
    ): void;

    buildExportCommand(payload: {
      readonly text: string;
      readonly voice?: string;
      readonly speed?: number;
      readonly filename?: string;
    }): {
      readonly command: string;
      readonly args: readonly (string | number)[];
      readonly pipedData: "";
      readonly options: Record<never, never>;
    };
  }
}

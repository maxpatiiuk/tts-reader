/**
 * Overwrite the buildExportCommand method on say.Say class to allow specifying
 * custom export format.
 */

import { Say } from "say";

export const speaker = new Say("darwin");
const originalBuildCommand = speaker.buildExportCommand;

let format = "aacf";

export function setFormat(newFormat: string): void {
  format = newFormat;
}

speaker.buildExportCommand = (
  payload
): ReturnType<typeof originalBuildCommand> => {
  const command = originalBuildCommand.call(speaker, payload);
  const filteredArguments = command.args.filter(
    (argument) =>
      typeof argument !== "string" || !argument.startsWith("--data-format")
  );
  return {
    ...command,
    args: [
      ...filteredArguments,
      ...(format === "" ? [] : [`--data-format=${format}`]),
    ],
  };
};

import { sortFunction } from './utils.js';

export const countLines = (lines: ReadonlyArray<string>): string =>
  Object.entries(
    lines.reduce<Record<string, number>>((counted, line) => {
      counted[line] ??= 0;
      counted[line]++;
      return counted;
    }, {})
  )
    .filter(([_line, count]) => count > 1)
    .sort(sortFunction(([_line, count]) => count, true))
    .map(([line, count]) => [count, line].join('\t'))
    .join('\n');

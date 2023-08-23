/**
 * A collection of helper functions for functional programming style
 * Kind of like underscore or ramda, but typesafe
 */
export const f = {
  /**
   * Since TypeScript is unaware of the NaN type, returning undefined
   * is a safer choice
   */
  parseInt(rawValue: string | undefined): number | undefined {
    if (rawValue === undefined) return undefined;
    const number = Number.parseInt(rawValue);
    return Number.isNaN(number) ? undefined : number;
  },
  unique: <T>(values: readonly T[]): readonly T[] =>
    Array.from(new Set(values)),
  id: <T>(value: T): T => value,
} as const;

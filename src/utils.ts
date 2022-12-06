/** Escape all characters that have special meaning in regular expressions */
export const escapeRegExp = (string: string): string =>
  string.replace(/[$()*+.?[\\\]^{|}]/gu, '\\$&');

const numberFormatter = new Intl.NumberFormat();
export const formatNumber = (number: number): string =>
  numberFormatter.format(number);

/** Escape all characters that have special meaning in regular expressions */

const numberFormatter = new Intl.NumberFormat();
export const formatNumber = (number: number): string =>
  numberFormatter.format(number);

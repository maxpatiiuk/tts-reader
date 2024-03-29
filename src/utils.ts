/** Escape all characters that have special meaning in regular expressions */

const numberFormatter = new Intl.NumberFormat();
export const formatNumber = (number: number): string =>
  numberFormatter.format(number);

/** Generate a sort function for Array.prototype.sort */
export const sortFunction =
  <T, V extends Date | boolean | number | string | null | undefined>(
    mapper: (value: T) => V,
    reverse = false
  ): ((left: T, right: T) => -1 | 0 | 1) =>
  (left: T, right: T): -1 | 0 | 1 => {
    const [leftValue, rightValue] = reverse
      ? [mapper(right), mapper(left)]
      : [mapper(left), mapper(right)];
    if (leftValue === rightValue) return 0;
    return typeof leftValue === 'string' && typeof rightValue === 'string'
      ? (leftValue.localeCompare(rightValue) as -1 | 0 | 1)
      : (leftValue ?? 0) > (rightValue ?? 0)
      ? 1
      : -1;
  };

export const normalizeArrays = <T>(array: T[] | T | undefined): T[] => {
  if (Array.isArray(array)) return array;
  return typeof array === 'function' ? [array] : [];
};

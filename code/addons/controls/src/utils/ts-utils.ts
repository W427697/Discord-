/**
 * Check if a value is not null. This is a type guard for TypeScript usually used in conjunction with array filter.
 * @param value - The value to check
 * @returns Whether the value is not null
 */
export function isNotNull<T>(value: T | null): value is T {
  return value !== null;
}

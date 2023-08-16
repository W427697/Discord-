/**
 * Helps make typescript error handling a little less ugly
 * @returns error.message when possible, stringifies the error as a fallback
 */
export const getErrorMessage = (error: unknown): string => (error as any)?.message ?? String(error);

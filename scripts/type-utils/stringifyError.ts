/**
 * Makes typescript error handling a little less ugly
 */
export const stringifyError = (error: unknown) =>
  error instanceof Error ? error.message : String(error);

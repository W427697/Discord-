/**
 * Makes typescript error handling a little less ugly
 */
export const stringifyError = (error: unknown) => (error as any)?.message ?? String(error);

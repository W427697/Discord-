/* eslint-disable local-rules/no-uncategorized-errors */
import { WebpackCompilationError } from './server-errors';

describe('WebpackCompilationError', () => {
  it('should correctly handle error with error property', () => {
    const error = new Error('Custom error message');
    const data = {
      error,
    };

    const webpackError = new WebpackCompilationError(data);

    expect(webpackError.message).toBe(error.message);
  });

  it('should correctly handle error with error within error', () => {
    const error = new Error('Custom error message');
    const data = {
      error: new Error() as Error & { error: Error },
    };
    data.error.error = error;

    const webpackError = new WebpackCompilationError(data);

    expect(webpackError.message).toBe(error.message);
  });

  it('should correctly handle error with stats.compilation.errors', () => {
    const compilationErrors = [new Error('Error 1 message'), new Error('Error 2 message')];
    const data = new Error() as Error & {
      error: Error & { stats?: { compilation: { errors: Error[] } } };
    };
    data.error = new Error();
    data.error.stats = {
      compilation: {
        errors: compilationErrors,
      },
    };

    const webpackError = new WebpackCompilationError(data);

    expect(webpackError.message).toMatchInlineSnapshot(`
      "Error: Error 1 message

      Error: Error 2 message"
    `);
  });

  it('should correctly handle object with compilation.errors', () => {
    const compilationErrors = [new Error('Error 1 message'), new Error('Error 2 message')];
    const data = {
      error: {
        compilation: {
          errors: compilationErrors,
        },
      },
    };

    const webpackError = new WebpackCompilationError(data);

    expect(webpackError.message).toMatchInlineSnapshot(`
      "Error: Error 1 message

      Error: Error 2 message"
    `);
  });

  it('should correctly handle error without specific format', () => {
    const errorMessage = 'Generic error message';
    const data = new Error() as Error & {
      error: Error;
    };

    data.error = new Error(errorMessage);

    const webpackError = new WebpackCompilationError(data);

    expect(webpackError.message).toBe(errorMessage);
  });
});

import { describe, it, expect } from 'vitest';
import dedent from 'ts-dedent';
import { UnknownFlowArgTypesError, WebpackCompilationError } from './server-errors';

describe('WebpackCompilationError', () => {
  it('should correctly handle error with stats.compilation.errors', () => {
    const errors = [
      new Error('Error 1 \u001B[4mmessage\u001B[0m'),
      new Error('\u001B[4mError\u001B[0m 2 message'),
    ];

    const webpackError = new WebpackCompilationError({ errors });

    expect(webpackError.data.errors[0].message).toEqual('Error 1 message');
    expect(webpackError.data.errors[1].message).toEqual('Error 2 message');
  });
});

describe('UnknownFlowArgTypesError', () => {
  it('should correctly handle error with Flow convertSig', () => {
    const type = {
      name: 'signature',
      type: 'number',
      signature: 1,
    };

    const message = dedent`We detected an Unknown Flow Type of type {"name":"signature","type":"number","signature":1} in your configuration.
    Storybook expects either a function or an object signature Flow type.
    Please check the Storybook configuration and ensure it has a valid Flow type.`;

    const typeError = new UnknownFlowArgTypesError({ type });
    expect(typeError.message).toEqual(message);
  });
});

import { describe, it, expect } from 'vitest';
import dedent from 'ts-dedent';
import { UnknownArgTypesError, WebpackCompilationError } from './server-errors';

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

    const message = dedent`We detected a type {"name":"signature","type":"number","signature":1} in your configuration.
    Your custom type does not match the TSFuncSigType or TSObjectSigType
    Please check your Storybook configuration and ensure you have defined a valid type.`;

    const typeError = new UnknownArgTypesError({ type });
    expect(typeError.message).toEqual(message);
  });
});

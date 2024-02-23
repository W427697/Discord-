import { vi, it, expect } from 'vitest';
import { sanitizeName } from './utils';
import { abortablePrettierFormat } from './utils';

const mockPrettier = vi.hoisted(() => {
  return {
    format: vi.fn(),
    resolveConfig: vi.fn(),
  };
});

vi.mock('prettier', () => {
  return {
    format: mockPrettier.format,
    resolveConfig: mockPrettier.resolveConfig,
  };
});

it('should sanitize names', () => {
  expect(sanitizeName('basic')).toMatchInlineSnapshot(`"Basic"`);
  expect(sanitizeName('with space')).toMatchInlineSnapshot(`"WithSpace"`);
  expect(sanitizeName('default')).toMatchInlineSnapshot(`"Default"`);
  expect(sanitizeName('w/punctuation')).toMatchInlineSnapshot(`"WPunctuation"`);
  expect(sanitizeName('5')).toMatchInlineSnapshot(`"_5"`);
});

describe('abortablePrettierFormat', () => {
  it('returns formatted code when prettier succeeds', async () => {
    mockPrettier.format.mockImplementation((code) => `${code}-FORMATTED`);
    mockPrettier.resolveConfig.mockResolvedValue({});

    const code = 'const foo = 123;';
    const codePath = '/path/to/code.js';

    const formattedCode = await abortablePrettierFormat(code, codePath);

    expect(formattedCode).toMatchInlineSnapshot(`"const foo = 123;-FORMATTED"`);
  });

  it('returns original code when prettier fails', async () => {
    mockPrettier.format.mockImplementation((code) => `${code}-FORMATTED`);
    mockPrettier.resolveConfig.mockRejectedValue(new Error('Prettier failed'));

    const code = 'const foo = 123;';
    const codePath = '/path/to/code.js';

    const formattedCode = await abortablePrettierFormat(code, codePath);

    expect(formattedCode).toEqual(code);
  });

  it('returns original code when prettier takes too long', async () => {
    mockPrettier.format.mockImplementation((code) => `${code}-FORMATTED`);
    mockPrettier.resolveConfig.mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve({});
          }, 200);
        })
    );

    const code = 'const foo = 123;';
    const codePath = '/path/to/code.js';

    const formattedCode = await abortablePrettierFormat(code, codePath, 100);

    expect(formattedCode).toEqual(code);
  });
});

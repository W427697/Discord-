import memoize from 'memoizerific';
import dedent from 'ts-dedent';

import type { Options as PrettierOptions } from 'prettier';
import prettier from 'prettier/standalone';

const supportedLanguages = ['jsx', 'js', 'html', 'css', 'scss'] as const;
type SupportedLanguage = typeof supportedLanguages[number];
const isSupported = (lang: string | undefined): lang is SupportedLanguage =>
  supportedLanguages.includes(lang as SupportedLanguage);

const getFormatterOptions = async (language: SupportedLanguage): Promise<PrettierOptions> => {
  switch (language) {
    case 'js':
    case 'jsx':
      return {
        parser: 'babel',
        plugins: [await import('prettier/parser-babel')],
      };
    case 'html':
      return {
        parser: 'html',
        plugins: [await import('prettier/parser-html')],
      };
    case 'css':
      return {
        parser: 'css',
        plugins: [await import('prettier/parser-postcss')],
      };
    case 'scss':
      return {
        parser: 'scss',
        plugins: [await import('prettier/parser-postcss')],
      };
    default: {
      // fail at typechecking if switch is not exhaustive
      const _: never = language;
      throw new Error('Unexpected default');
    }
  }
};

/**
 * Given `code` and specified `language`, we format the source code
 * with Prettier. If the language is not specified explicitly,
 * we only remove leading whitespace from all lines.
 */
// `language: string | undefined` is less idiomatic than `language?: string`,
// but memoizerific enforces constant number of arguments
export const formatter = memoize(2)(async (code: string, language: string | undefined) => {
  if (isSupported(language)) {
    const options = await getFormatterOptions(language);
    return prettier.format(code, { printWidth: 67, ...options });
  }

  return dedent(code);
});

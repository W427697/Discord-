// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import loaderUtils from 'next/dist/compiled/loader-utils3';
import { getProjectRoot } from '@storybook/core-common';
import path from 'path';

import type { LoaderOptions } from '../types';

type LocalFontSrc = string | Array<{ path: string; weight?: string; style?: string }>;

export async function getFontFaceDeclarations(options: LoaderOptions, rootContext: string) {
  const localFontSrc = options.props.src as LocalFontSrc;

  // Parent folder relative to the root context
  const parentFolder = path
    .dirname(path.join(getProjectRoot(), options.filename))
    .replace(rootContext, '');

  const { validateData } = require('../utils/local-font-utils');
  const { weight, style, variable } = validateData('', options.props);

  const id = `font-${loaderUtils.getHashDigest(
    Buffer.from(JSON.stringify(localFontSrc)),
    'md5',
    'hex',
    6
  )}`;

  const declarations = (options.props.declarations || [])
    .map(({ prop, value }: { prop: string; value: string }) => `${prop}: ${value};`)
    .join('\n');

  const arePathsWin32Format = /^[a-z]:\\/iu.test(options.filename);
  const cleanWin32Path = (pathString: string): string =>
    arePathsWin32Format ? pathString.replace(/\\/gu, '/') : pathString;

  const getFontFaceCSS = () => {
    if (typeof localFontSrc === 'string') {
      const localFontPath = cleanWin32Path(path.join(parentFolder, localFontSrc));

      return `@font-face {
          font-family: ${id};
          src: url(.${localFontPath});
          ${declarations}
      }`;
    }
    return localFontSrc
      .map((font) => {
        const localFontPath = cleanWin32Path(path.join(parentFolder, font.path));

        return `@font-face {
          font-family: ${id};
          src: url(.${localFontPath});
          ${font.weight ? `font-weight: ${font.weight};` : ''}
          ${font.style ? `font-style: ${font.style};` : ''}
          ${declarations}
        }`;
      })
      .join('');
  };

  return {
    id,
    fontFamily: id,
    fontFaceCSS: getFontFaceCSS(),
    weights: weight ? [weight] : [],
    styles: style ? [style] : [],
    variable,
  };
}

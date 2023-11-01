import type { LoaderContext } from 'webpack';
import { loadCsf, enrichCsf, formatCsf } from '@storybook/csf-tools';
import fs from 'fs/promises';
import type { CsfOptions } from '.';

type LoaderFunction = (
  this: LoaderContext<CsfOptions>,
  source: string | Buffer,
  sourceMap?: any,
  meta?: any
) => void;

const logger = console;

const CsfWebpackLoaderFn: LoaderFunction = async function CsfWebpackLoaderFn(
  source,
  sourceMap,
  meta
) {
  // Indicate that the loader is asynchronous.
  const callback = this.async();
  const filename = this.resourcePath;

  // Access the loader options
  const options = this.getOptions() || {};

  try {
    const originalCode = await fs.readFile(filename, 'utf-8');
    const csf = loadCsf(source as string, originalCode, {
      makeTitle: (userTitle) => userTitle || 'default',
    }).parse();
    enrichCsf(csf, options);
    const result = formatCsf(csf, { sourceMaps: true, inputSourceMap: sourceMap });

    if (typeof result === 'string') {
      callback(null, result);
    } else {
      callback(null, result.code, result.map || undefined);
    }
  } catch (err: any) {
    // Handle errors.
    if (!err.message?.startsWith('CSF:')) {
      logger.warn(err.message);
    }

    callback(null, source, sourceMap);
  }
};

export default CsfWebpackLoaderFn as (source: string, sourceMap: any, meta: any) => void;

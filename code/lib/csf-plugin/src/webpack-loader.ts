import fs from 'fs/promises';
import type { EnrichCsfOptions } from '@storybook/csf-tools';
import { loadCsf, formatCsf, enrichCsf } from '@storybook/csf-tools';

interface LoaderContext {
  async: () => (err: Error | null, result?: string, map?: any) => void;
  getOptions: () => EnrichCsfOptions;
  resourcePath: string;
}

async function loader(this: LoaderContext, content: string, map: any) {
  const callback = this.async();
  const options = this.getOptions();
  const id = this.resourcePath;

  const sourceCode = await fs.readFile(id, 'utf-8');

  try {
    const makeTitle = (userTitle: string) => userTitle || 'default';
    const csf = loadCsf(content, { makeTitle }).parse();
    const csfSource = loadCsf(sourceCode, { makeTitle }).parse();
    enrichCsf(csf, csfSource, options);
    const formattedCsf = formatCsf(csf, { sourceMaps: true, inputSourceMap: map }, content);

    if (typeof formattedCsf === 'string') {
      return callback(null, formattedCsf, map);
    }

    callback(null, formattedCsf.code, formattedCsf.map);
  } catch (err: any) {
    // This can be called on legacy storiesOf files, so just ignore
    // those errors. But warn about other errors.
    if (!err.message?.startsWith('CSF:')) {
      console.warn(err.message);
    }
    callback(null, content, map);
  }
}

export default loader;

// eslint-disable-next-line import/no-unresolved
import * as fse from 'fs-extra/esm';

export async function readTemplate(filename: string) {
  return fse.readFile(filename, {
    encoding: 'utf8',
  });
}

import path, { dirname, join } from 'path';
import { readFile, pathExists } from 'fs-extra';

const interpolate = (string: string, data: Record<string, string> = {}) =>
  Object.entries(data).reduce((acc, [k, v]) => acc.replace(new RegExp(`%${k}%`, 'g'), v), string);

const getTemplatePath = async (template: string) => {
  return join(dirname(require.resolve('@storybook/manager-webpack5/package.json')), template);
};
const getTemplate = async (template: string) => {
  const path = await getTemplatePath(template);

  return readFile(path, 'utf8');
};

export async function getManagerHeadTemplate(
  configDirPath: string,
  interpolations: Record<string, string>
) {
  const [base, head] = await Promise.all([
    getTemplate('base-manager-head.html'),
    pathExists(path.resolve(configDirPath, 'manager-head.html')).then<Promise<string> | false>(
      (exists) => {
        if (exists) {
          return readFile(path.resolve(configDirPath, 'manager-head.html'), 'utf8');
        }
        return false;
      }
    ),
  ] as [Promise<string>, Promise<string | false>]);
  let result = base;

  if (head) {
    result += head;
  }

  return interpolate(result, interpolations);
}

export async function getManagerMainTemplate() {
  return getTemplatePath(`manager.ejs`);
}

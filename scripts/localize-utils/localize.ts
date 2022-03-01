import { dirname, join, relative } from 'path';
import resolveFrom from 'resolve-from';

export const localize = (reporter: (err: Error) => void, ref: string, input: string) => {
  try {
    const packageName = getPackageName(input);

    // the absolute path including where the main field points to
    // we add package.json here and then remove it,
    // to ensure we resolve the directory correctly
    // even when no mainfields are defined
    const resolved = dirname(resolveFrom(ref, join(packageName, 'package.json')));

    // the relative path including where main field points to
    const relativePath = relative(ref, resolved);

    // the relative path to base of the module
    const root = relativePath
      .replace(new RegExp(`(../|node_modules/)${packageName}.*$`), '$1')
      .substring(1);

    // rename node_modules to local_modules
    const renamed = root.replace('node_modules', 'local_modules');

    const full = join(renamed, input);

    return full;
  } catch (e) {
    reporter(e);
    return input;
  }
};

export const getPackageName = (input: string) => {
  if (input.match(/^@/)) {
    // @storybook/foo/bla/bla => @storybook/foo
    return (input.match(/^@[^/]+\/[^/]+/) || [])[0];
  }
  return input.split('/')[0];
};

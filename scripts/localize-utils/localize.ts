import { dirname, join, relative } from 'path';
import resolveFrom from 'resolve-from';

export const localize = (
  reporter: (err: Error) => void,
  externals: string[],
  ref: string,
  input: string
) => {
  try {
    const packageName = getPackageName(input);

    if (externals.includes(packageName)) {
      return input;
    }

    // the absolute path including where the main field points to
    // we add package.json here and then remove it,
    // to ensure we resolve the directory correctly
    // even when no mainfields are defined
    const resolved = dirname(resolveFrom(ref, join(packageName, 'package.json')));

    // the relative path including where main field points to
    const relativePath = relative(ref, resolved);

    let base = relativePath.replace(new RegExp(`(../|node_modules/)${packageName}.*$`), '$1');

    // when a request is made to a scoped package from the same scoped package
    // we compensate for the fact the packageName isn't present in the relativePath
    if (base === relativePath) {
      base = join(relativePath, '..', '..');
    }
    // the relative path to base of the module
    const root = base.substring(1);

    // rename node_modules to local_modules
    const renamed = root.replace('node_modules', 'local_modules');

    let full = join(renamed, input);

    // path.join will turn './foo' into 'foo', probably assuming that will be the same
    // but for node it is important, we need the preceding './'
    if (!full.startsWith('.')) {
      full = `./${full}`;
    }

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

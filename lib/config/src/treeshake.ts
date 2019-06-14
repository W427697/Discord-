import { rollup, OutputOptions } from 'rollup';

import builtins from 'rollup-plugin-node-builtins';
import resolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import commonjs from 'rollup-plugin-commonjs';
import virtualModule from './roll-up-plugin-virtual';

const treeshake = async (location: string, source: string, cacheDir: string | null) => {
  const outputOptions: OutputOptions = {
    format: 'esm',
    dir: cacheDir,
  };

  const bundle = await rollup({
    input: location,
    treeshake: {
      annotations: false,
      propertyReadSideEffects: false,
      pureExternalModules: true,
    },
    external: id => {
      return id !== location && !id.match('storybook.config');
    },
    plugins: [
      virtualModule({ [location]: source }),
      builtins(),
      resolve({
        preferBuiltins: true,
      }),
      commonjs(),
      replace({
        ENVIRONMENT: JSON.stringify('production'),
      }),
    ],
    onwarn: () => {},
  });

  const { output } = await bundle.generate(outputOptions);

  if (cacheDir) {
    await bundle.write(outputOptions);
  }

  return output;
};

export { treeshake };

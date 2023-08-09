import { baseGenerator } from '../baseGenerator';
import type { Generator } from '../types';

const generator: Generator = async (packageManager, npmOptions, options) => {
  // addWorkaroundResolutions
  // await packageManager.addPackageResolutions({
  //   'strip-ansi': '~6.0.0',
  //   'string-width': '~4.2.3', // nuxt fails to build if version is >=5.0.0, because 5.0.0 is not exporting cjs
  //   'wrap-ansi': '~8.1.0',
  // });

  await baseGenerator(packageManager, npmOptions, options, 'vue3', {}, 'nuxt');
};

export default generator;

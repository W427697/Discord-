import { baseGenerator, Generator } from '../baseGenerator';

const litGenerator: Generator = (packageManager, npmOptions, options) => {
  return baseGenerator(packageManager, npmOptions, options, 'lit', {});
};

export default litGenerator;

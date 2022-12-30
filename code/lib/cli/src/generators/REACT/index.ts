import { detectLanguage } from '../../detect';
import { SupportedLanguage } from '../../project_types';
import { baseGenerator } from '../baseGenerator';
import type { Generator } from '../types';

const generator: Generator = async (packageManager, npmOptions, options) => {
  // Add prop-types dependency if not using TypeScript
  const extraPackages = [];
  const language = detectLanguage();
  if (language === SupportedLanguage.JAVASCRIPT) {
    extraPackages.push('prop-types');
  }

  await baseGenerator(packageManager, npmOptions, options, 'react', {
    extraPackages,
  });
};

export default generator;

import { detectLanguage } from '../../detect';
import { SupportedLanguage } from '../../project_types';
import { baseGenerator } from '../baseGenerator';
import type { Generator } from '../types';

const generator: Generator = async (packageManager, npmOptions, options) => {
  // Add prop-types dependency if not using TypeScript
  const language = detectLanguage();
  const extraPackages = language === SupportedLanguage.JAVASCRIPT ? ['prop-types'] : [];
  const extraMain = { typescript: { reactDocgen: false } };

  await baseGenerator(packageManager, npmOptions, options, 'react', {
    extraMain,
    extraPackages,
  });
};

export default generator;

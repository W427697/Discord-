import { Configuration } from 'webpack';
import { getRaxWebpackConfig } from './get-rax-wabpack-config';

export function webpackFinal(config: Configuration) {
  const raxWebpackConfig = getRaxWebpackConfig();

  // Conflict with rax css loader, remove it
  const cssRuleIndex = config.module.rules.findIndex(
    (rule) => rule.test.toString() === '/\\.css$/'
  );
  if (cssRuleIndex) {
    config.module.rules.splice(cssRuleIndex, 1);
  }

  return {
    ...config,
    module: {
      rules: [...config.module.rules, ...raxWebpackConfig.module.rules],
    },
    plugins: [...config.plugins, ...raxWebpackConfig.plugins],
  };
}

import getWebpackConfig from 'rax-webpack-config';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import getBabelConfig from 'rax-babel-config';
import path from 'path';
import Config, { Rule } from 'webpack-chain';

const setPostCssConfig = (rule: Rule) => {
  rule.use('postcss-loader').tap((options) => {
    return {
      ...options,
      config: {
        path: path.resolve(__dirname),
      },
    };
  });
};

export const getRaxWebpackConfig = () => {
  const babelConfig = getBabelConfig({});
  const webpackConfig: Config = getWebpackConfig({
    babelConfig,
  });

  ['css', 'less', 'scss'].forEach((item) => {
    const rule = webpackConfig.module.rule(item);
    const moduleRule = webpackConfig.module.rule(`${item}-module`);

    setPostCssConfig(rule);
    setPostCssConfig(moduleRule);
  });

  return webpackConfig.toConfig();
};

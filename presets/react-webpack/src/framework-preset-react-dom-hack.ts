import { readJSON } from 'fs-extra';
import type { StorybookConfig } from '@storybook/core-webpack';
import { getBuilder } from '@storybook/core-common';

// this is a hack to allow importing react-dom/client even when it's not available
// this should be removed once we drop support for react-dom < 18

export const webpackFinal: StorybookConfig['webpackFinal'] = async (config, options) => {
  const builder = await getBuilder(options);
  let reactDomPkg;
  try {
    reactDomPkg = await readJSON(require.resolve('react-dom/package.json'));
  } catch (e) {
    //
  }

  return {
    ...config,
    plugins: [
      ...(config.plugins || []),
      reactDomPkg?.version?.startsWith('18') || reactDomPkg?.version?.startsWith('0.0.0')
        ? null
        : new builder.IgnorePlugin({
            resourceRegExp: /react-dom\/client$/,
            contextRegExp:
              /(renderers\/react|renderers\\react|@storybook\/react|@storybook\\react)/, // TODO this needs to work for both in our MONOREPO and in the user's NODE_MODULES
          }),
    ].filter(Boolean),
  };
};

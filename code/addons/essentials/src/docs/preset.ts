/* eslint-disable import/export */
export * from '@storybook/addon-docs/dist/preset';

export const mdxLoaderOptions = async (config: any) => {
  // eslint-disable-next-line no-param-reassign
  config.mdxCompileOptions.providerImportSource = require.resolve(
    '@storybook/addon-docs/dist/shims/mdx-react-shim'
  );
  return config;
};

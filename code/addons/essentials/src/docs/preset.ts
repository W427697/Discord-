/* eslint-disable import/export */
export * from '@junk-temporary-prototypes/addon-docs/dist/preset';

export const mdxLoaderOptions = async (config: any) => {
  // eslint-disable-next-line no-param-reassign
  config.mdxCompileOptions.providerImportSource = '@junk-temporary-prototypes/addon-essentials/docs/mdx-react-shim';
  return config;
};

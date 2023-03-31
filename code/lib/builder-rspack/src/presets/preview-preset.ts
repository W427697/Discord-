import rspackConfig from '../preview/iframe-rspack.config';

export const rspack = async (_: unknown, options: any) => rspackConfig(options);

export const previewMainTemplate = () =>
  require.resolve('@storybook/builder-rspack/templates/preview.ejs');

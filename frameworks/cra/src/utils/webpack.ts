import type { RuleSetRule, WebpackPluginInstance } from 'webpack';

const ignoredWebpackPluginFromCRA =
  /(DefinePlugin|HtmlWebpackPlugin|InlineChunkHtmlPlugin|InterpolateHtmlPlugin|WebpackManifestPlugin)/;

// eslint-disable-next-line camelcase
export const filterStorybookRules = (r: RuleSetRule & { custom_id?: string }): boolean =>
  r.custom_id !== 'storybook_babel' &&
  r.custom_id !== 'storybook_css' &&
  r.custom_id !== 'storybook_media';

export const filterCRAPlugins = (p: WebpackPluginInstance) =>
  !p.constructor.name.match(ignoredWebpackPluginFromCRA);

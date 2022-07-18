import type { RuleSetRule, WebpackPluginInstance } from 'webpack';

const ignoredWebpackPluginFromCRA =
  /(DefinePlugin|HtmlWebpackPlugin|InlineChunkHtmlPlugin|InterpolateHtmlPlugin|WebpackManifestPlugin)/;

export const filterStorybookRules = (r: RuleSetRule): boolean =>
  r.layer !== 'storybook_babel' && r.layer !== 'storybook_css' && r.layer !== 'storybook_media';

export const filterCRAPlugins = (p: WebpackPluginInstance) =>
  !p.constructor.name.match(ignoredWebpackPluginFromCRA);

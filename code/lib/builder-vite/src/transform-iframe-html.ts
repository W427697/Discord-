import { normalizeStories } from '@storybook/core-common';
import type { CoreConfig } from '@storybook/core-common';
import { getFrameworkName } from './utils/get-framework-name';
import type { ExtendedOptions } from './types';

export type PreviewHtml = string | undefined;

export async function transformIframeHtml(html: string, options: ExtendedOptions) {
  const { configType, features, presets, serverChannelUrl, title } = options;
  const framework = await getFrameworkName(options);
  const headHtmlSnippet = await presets.apply<PreviewHtml>('previewHead');
  const bodyHtmlSnippet = await presets.apply<PreviewHtml>('previewBody');
  const logLevel = await presets.apply('logLevel', undefined);

  // TODO: pull this into frameworks?
  let frameworkOptions;
  if (framework.includes('react')) {
    frameworkOptions = await presets.apply(`reactOptions`, {});
  } else if (framework.includes('svelte')) {
    frameworkOptions = await presets.apply(`svelteOptions`, {});
  }

  const coreOptions = await presets.apply<CoreConfig>('core');
  const stories = normalizeStories(await options.presets.apply('stories', [], options), {
    configDir: options.configDir,
    workingDir: process.cwd(),
  }).map((specifier) => ({
    ...specifier,
    importPathMatcher: specifier.importPathMatcher.source,
  }));

  return html
    .replace('<!-- [TITLE HERE] -->', title || 'Storybook')
    .replace('[CONFIG_TYPE HERE]', configType || '')
    .replace('[LOGLEVEL HERE]', logLevel || '')
    .replace(`'[FRAMEWORK_OPTIONS HERE]'`, JSON.stringify(frameworkOptions || {}))
    .replace(
      `'[CHANNEL_OPTIONS HERE]'`,
      JSON.stringify(coreOptions && coreOptions.channelOptions ? coreOptions.channelOptions : {})
    )
    .replace(`'[FEATURES HERE]'`, JSON.stringify(features || {}))
    .replace(`'[STORIES HERE]'`, JSON.stringify(stories || {}))
    .replace(`'[SERVER_CHANNEL_URL HERE]'`, JSON.stringify(serverChannelUrl))
    .replace('<!-- [HEAD HTML SNIPPET HERE] -->', headHtmlSnippet || '')
    .replace('<!-- [BODY HTML SNIPPET HERE] -->', bodyHtmlSnippet || '');
}

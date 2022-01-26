/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable import/no-extraneous-dependencies */
import { loadAllPresets, loadPreviewOrConfigFile } from '@storybook/core-common';
import { composeConfigs } from '@storybook/preview-web';

export const getAllPresets = (configDir: string) => {
  console.log('!!!!!!!! CALLING GET ALL PRESETS');
  const dummyData = {
    // @ts-ignore
    frameworkPresets: [],
    // @ts-ignore
    corePresets: [],
    // @ts-ignore
    overridePresets: [],
    framework: 'react',
    ignorePreview: false,
    // @ts-ignore
    cache: undefined,
    docsMode: false,
    packageJson: {
      name: 'test',
      version: '1.0.0',
    },
  };

  const presets = loadAllPresets({
    configDir,
    ...dummyData,
  });

  // if we need to filter certain addons
  const denyList: string[] = [];

  // const configs = [
  //   ...(await presets.apply('config', [], { configDir })),
  //   loadPreviewOrConfigFile({ configDir }),
  // ]
  //   .filter(Boolean)
  //   .filter((cfg) => denyList.every((deny) => !cfg.includes(deny)));

  const configs = [
    '/Users/yannbraga/open-source/storybook/addons/docs/dist/esm/frameworks/common/config.js',
    '/Users/yannbraga/open-source/storybook/addons/docs/dist/esm/frameworks/react/config.js',
    '/Users/yannbraga/open-source/storybook/addons/actions/dist/esm/preset/addDecorator.js',
    '/Users/yannbraga/open-source/storybook/addons/actions/dist/esm/preset/addArgs.js',
    '/Users/yannbraga/open-source/storybook/addons/backgrounds/dist/esm/preset/addDecorator.js',
    '/Users/yannbraga/open-source/storybook/addons/backgrounds/dist/esm/preset/addParameter.js',
    '/Users/yannbraga/open-source/storybook/addons/measure/dist/esm/preset/addDecorator.js',
    '/Users/yannbraga/open-source/storybook/addons/outline/dist/esm/preset/addDecorator.js',
    '/Users/yannbraga/open-source/storybook/examples/cra-ts-essentials/.storybook/preview.tsx',
  ];

  // @ts-ignore
  const allConfigs = configs.map((preset) => require(preset) || {});
  return composeConfigs(allConfigs);
};

import { ModuleInfo } from '@fal-works/esbuild-plugin-global-externals';

export enum Keys {
  'react' = 'REACT',
  'react-dom' = 'REACT-DOM',
  '@storybook/components' = 'STORYBOOKCOMPONENTS',
  '@storybook/channels' = 'STORYBOOKCHANNELS',
  '@storybook/core-events' = 'STORYBOOKCORE-EVENTS',
  '@storybook/router' = 'STORYBOOKROUTER',
  '@storybook/theming' = 'STORYBOOKTHEMING',
  '@storybook/api' = 'STORYBOOKAPI',
  '@storybook/addons' = 'STORYBOOKADDONS',
  '@storybook/client-logger' = 'STORYBOOKCLIENTLOGGER',
}
export type Definitions = Required<Record<keyof typeof Keys, Required<ModuleInfo>>>;

import type { ModuleInfo } from '@fal-works/esbuild-plugin-global-externals';

// Here we map the name of a module to their NAME in the global scope.
export enum Keys {
  'react' = '__REACT__',
  'react-dom' = '__REACTDOM__',
  '@storybook/components' = '__STORYBOOK_MODULE_COMPONENTS__',
  '@storybook/components/experimental' = '__STORYBOOK_MODULE_COMPONENTS_EXPERIMENTAL__',
  '@storybook/channels' = '__STORYBOOK_MODULE_CHANNELS__',
  '@storybook/core-events' = '__STORYBOOK_MODULE_CORE_EVENTS__',
  '@storybook/router' = '__STORYBOOK_MODULE_ROUTER__',
  '@storybook/theming' = '__STORYBOOK_MODULE_THEMING__',
  '@storybook/api' = '__STORYBOOK_MODULE_API__', // deprecated, remove in 8.0
  '@storybook/manager-api' = '__STORYBOOK_MODULE_API__',
  '@storybook/addons' = '__STORYBOOK_MODULE_ADDONS__',
  '@storybook/client-logger' = '__STORYBOOK_MODULE_CLIENT_LOGGER__',
}

export type Definitions = Required<Record<keyof typeof Keys, Required<ModuleInfo>>>;

import type { ModuleInfo } from '@fal-works/esbuild-plugin-global-externals';

// Here we map the name of a module to their NAME in the global scope.
export enum Keys {
  'react' = '__REACT__',
  'react-dom' = '__REACTDOM__',
  '@junk-temporary-prototypes/components' = '__STORYBOOKCOMPONENTS__',
  '@junk-temporary-prototypes/channels' = '__STORYBOOKCHANNELS__',
  '@junk-temporary-prototypes/core-events' = '__STORYBOOKCOREEVENTS__',
  '@junk-temporary-prototypes/router' = '__STORYBOOKROUTER__',
  '@junk-temporary-prototypes/theming' = '__STORYBOOKTHEMING__',
  '@junk-temporary-prototypes/api' = '__STORYBOOKAPI__', // deprecated, remove in 8.0
  '@junk-temporary-prototypes/manager-api' = '__STORYBOOKAPI__',
  '@junk-temporary-prototypes/addons' = '__STORYBOOKADDONS__',
  '@junk-temporary-prototypes/client-logger' = '__STORYBOOKCLIENTLOGGER__',
}

export type Definitions = Required<Record<keyof typeof Keys, Required<ModuleInfo>>>;

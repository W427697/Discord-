import type { ModuleInfo } from '@fal-works/esbuild-plugin-global-externals';

import * as REACT from 'react';
import * as REACTDOM from 'react-dom';

import * as STORYBOOKCOMPONENTS from '@storybook/components';
import * as STORYBOOKCHANNELS from '@storybook/channels';
import * as STORYBOOKEVENTS from '@storybook/core-events';
import * as STORYBOOKROUTER from '@storybook/router';
import * as STORYBOOKTHEMING from '@storybook/theming';
import * as STORYBOOKAPI from '@storybook/api';
import * as STORYBOOKADDONS from '@storybook/addons';
import * as STORYBOOKCLIENTLOGGER from '@storybook/client-logger';

const remove = (regex?: RegExp) => (input: string) =>
  !(input === 'default' || (regex && regex.test(input)));

const createModuleInfo = (name: string, value: unknown): Required<ModuleInfo> => ({
  type: 'esm',
  varName: `__${name}__`,
  namedExports: Object.keys(value).filter(remove(/^__/)),
  defaultExport: true,
});

export const values = {
  react: REACT,
  'react-dom': REACTDOM,
  '@storybook/components': STORYBOOKCOMPONENTS,
  '@storybook/channels': STORYBOOKCHANNELS,
  '@storybook/core-events': STORYBOOKEVENTS,
  '@storybook/router': STORYBOOKROUTER,
  '@storybook/theming': STORYBOOKTHEMING,
  '@storybook/api': STORYBOOKAPI,
  '@storybook/addons': STORYBOOKADDONS,
  '@storybook/client-logger': STORYBOOKCLIENTLOGGER,
} as const;

export const definitions: Required<Record<keyof typeof values, Required<ModuleInfo>>> = {
  react: createModuleInfo('REACT', REACT),
  'react-dom': createModuleInfo('REACTDOM', REACTDOM),
  '@storybook/components': createModuleInfo('STORYBOOKCOMPONENTS', STORYBOOKCOMPONENTS),
  '@storybook/channels': createModuleInfo('STORYBOOKCHANNELS', STORYBOOKCHANNELS),
  '@storybook/core-events': createModuleInfo('STORYBOOKEVENTS', STORYBOOKEVENTS),
  '@storybook/router': createModuleInfo('STORYBOOKROUTER', STORYBOOKROUTER),
  '@storybook/theming': createModuleInfo('STORYBOOKTHEMING', STORYBOOKTHEMING),
  '@storybook/api': createModuleInfo('STORYBOOKAPI', STORYBOOKAPI),
  '@storybook/addons': createModuleInfo('STORYBOOKADDONS', STORYBOOKADDONS),
  '@storybook/client-logger': createModuleInfo('STORYBOOKCLIENTLOGGER', STORYBOOKCLIENTLOGGER),
};

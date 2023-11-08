import { open } from 'fs/promises';
import { CoreBuilder } from '../../project_types';
import { baseGenerator } from '../baseGenerator';
import type { Generator } from '../types';

const previewTS = `
import type { Preview } from '@storybook/react';
import { Mock } from '@storybook/nextjs-server/mock';

const preview: Preview = {
  decorators: [
    (storyFn, { args }) => {
      Mock.set(args?.$mock);
      return storyFn();
    },
  ],
  argTypes: {
    $mock: { control: { type: 'object' }, target: 'mock' },
  },
};

export default preview;
`;

const generator: Generator = async (packageManager, npmOptions, options) => {
  await baseGenerator(
    packageManager,
    npmOptions,
    { ...options, builder: CoreBuilder.Vite },
    'react',
    {
      extraPackages: ['vite'],
      extraMain: { docs: { autodocs: false } },
    },
    'nextjs-server'
  );
  // add /app/storybookPreview to .gitignore
  // overwrite .storybook/preview.js
  const preview = await open('./.storybook/preview.ts', 'w');
  await preview.write(previewTS);
  await preview.close();

  const gitignore = await open('./.gitignore', 'a');
  await gitignore.write('\n/app/storybookPreview');
  await preview.close();
};

export default generator;

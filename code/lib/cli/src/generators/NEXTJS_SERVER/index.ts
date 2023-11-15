import { open, appendFile } from 'fs/promises';
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
      extraMain: { docs: { autodocs: false } },
    },
    'nextjs-server'
  );
  // add /app/storybookPreview to .gitignore
  // overwrite .storybook/preview.js
  const preview = await open('./.storybook/preview.ts', 'w');
  await preview.truncate();
  await preview.write(previewTS);
  await preview.close();

  await appendFile('./.gitignore', '\n/app/(sb)/storybookPreview\n');
};

export default generator;

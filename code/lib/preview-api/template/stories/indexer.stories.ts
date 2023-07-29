import { expect } from '@storybook/jest';
import { global as globalThis } from '@storybook/global';
import type { PlayFunctionContext } from '@storybook/types';

export default {
  component: globalThis.Components.Pre,
  args: { text: 'Check that id assertions in interaction tests are passing' },
  id: 'indexer-custom-meta-id',
};

// FIXME: fails with "Didn't find 'lib-preview-api-indexer--default' in CSF file, this is unexpected"
export const Default = {
  play: async ({ id }: PlayFunctionContext<any>) => {
    await expect(id).toBe('indexer-custom-meta-id--default');
  },
};

// FIXME: fails with Didn't find 'lib-preview-api-indexer--custom-parameters-id' in CSF file, this is unexpected
export const CustomParametersId = {
  parameters: {
    __id: 'custom-id',
  },
  play: async ({ id }: PlayFunctionContext<any>) => {
    await expect(id).toBe('indexer-custom-meta-id--custom-id');
  },
};

import type { ArgTypes } from '@storybook/csf';

export interface ArgTypesInfoPayload {
  storyId: string;
}

export interface ArgTypesInfoResult {
  success: true | false;
  result: null | {
    argTypes: ArgTypes;
  };
  error: null | string;
}

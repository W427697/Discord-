import type { API_Provider } from '@storybook/types';
import type { API, ModuleFn } from '../index';

export interface SubAPI {
  renderPreview?: API_Provider<API>['renderPreview'];
}

// eslint-disable-next-line @typescript-eslint/ban-types
export const init: ModuleFn<SubAPI, {}, true> = ({ provider, fullAPI }) => {
  return {
    api: provider.renderPreview ? { renderPreview: provider.renderPreview } : {},
    state: {},
    init: () => {
      provider.handleAPI(fullAPI);
    },
  };
};

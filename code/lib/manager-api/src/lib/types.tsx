import type { API_ProviderData } from '@storybook/core/dist/modules/types/index';
import type { RouterData } from '@storybook/router';

import type { API, State } from '../index';
import type Store from '../store';

export type ModuleFn<APIType = unknown, StateType = unknown> = (
  m: ModuleArgs,
  options?: any
) => {
  init?: () => void | Promise<void>;
  api: APIType;
  state: StateType;
};

export type ModuleArgs = RouterData &
  API_ProviderData<API> & {
    mode?: 'production' | 'development';
    state: State;
    fullAPI: API;
    store: Store;
  };

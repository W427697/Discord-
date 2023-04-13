import { EventEmitter } from 'events';
import { PROJECT_PREPARED } from '@storybook/core-events';

import type { ModuleArgs } from '../index';
import { init as initModule } from '../modules/projectAnnotations';

const { getEventMetadata } = require('../lib/events');

jest.mock('@storybook/client-logger');
jest.mock('../lib/events');
beforeEach(() => {
  getEventMetadata.mockReset().mockReturnValue({ sourceType: 'local' });
});

function createMockStore() {
  let state = {};
  return {
    getState: jest.fn().mockImplementation(() => state),
    setState: jest.fn().mockImplementation((s) => {
      state = { ...state, ...s };
    }),
  };
}

describe('projectAnnotations API', () => {
  it('set annotations on PROJECT_PREPARED, local', () => {
    const api = Object.assign(new EventEmitter(), {});
    const store = createMockStore();
    const {
      state,
      init,
      api: newApi,
    } = initModule({ store, fullAPI: api } as unknown as ModuleArgs);
    store.setState(state);
    init();

    api.emit(PROJECT_PREPARED, {
      parameters: { a: 'b' },
      argTypes: { a: { type: { name: 'string' } } },
    });
    expect(store.getState()).toEqual({
      projectAnnotations: {
        parameters: { a: 'b' },
        argTypes: { a: { type: { name: 'string' } } },
      },
    });
    expect(newApi.getProjectAnnotations()).toEqual({
      parameters: { a: 'b' },
      argTypes: { a: { type: { name: 'string' } } },
    });
  });

  it('set annotations on PROJECT_PREPARED, ref', () => {
    const api = Object.assign(new EventEmitter(), { updateRef: jest.fn() });
    const store = createMockStore();
    const { state, init } = initModule({ store, fullAPI: api } as unknown as ModuleArgs);
    store.setState(state);
    init();

    getEventMetadata.mockReturnValueOnce({ sourceType: 'external', ref: { id: 'ref' } });
    api.emit(PROJECT_PREPARED, {
      parameters: { a: 'b' },
      argTypes: { a: { type: { name: 'string' } } },
    });

    expect(api.updateRef).toHaveBeenCalledWith('ref', {
      projectAnnotations: {
        parameters: { a: 'b' },
        argTypes: { a: { type: { name: 'string' } } },
      },
    });
  });
});

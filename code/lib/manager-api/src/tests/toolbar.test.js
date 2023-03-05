import { FORCE_REMOUNT } from '@storybook/core-events';
import { init as initToolbar } from '../modules/toolbar';

describe('toolbar API', () => {
  function getValidMockedStore() {
    const store = {
      getState: () => ({
        remount: { isAnimating: true },
        storyId: 'primary-btn-test',
      }),
      setState: jest.fn(),
    };
    return store;
  }

  function getInvalidMockedStore() {
    const store = {
      getState: () => ({
        remount: { isAnimating: false },
        storyId: null,
      }),
      setState: jest.fn(),
    };
    return store;
  }

  it('does not remount component if storyId is null', () => {
    const store = getInvalidMockedStore();

    const { api } = initToolbar({ store });

    api.remount();
    expect(store.setState).not.toHaveBeenCalledWith();
  });

  it('remounts component and starts animation', () => {
    const store = getValidMockedStore();
    const { storyId } = store.getState();
    const mockFullApi = { emit: jest.fn() };

    const { api } = initToolbar({ store, fullAPI: mockFullApi });

    api.remount();
    expect(mockFullApi.emit).toHaveBeenCalledWith(FORCE_REMOUNT, { storyId });
    expect(store.setState).toHaveBeenCalledWith({
      remount: { isAnimating: true },
    });
  });

  it('ends remount animation', () => {
    const store = getValidMockedStore();

    const { api } = initToolbar({ store });

    api.remountEnd();
    expect(store.setState).toHaveBeenCalledWith({
      remount: { isAnimating: false },
    });
  });
});

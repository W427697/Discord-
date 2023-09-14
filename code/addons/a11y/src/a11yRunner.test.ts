import type { Mock, Mocked } from 'vitest';
import { describe, beforeEach, it, expect, vi } from 'vitest';
import { addons } from '@storybook/preview-api';
import { EVENTS } from './constants';

vi.mock('@storybook/preview-api');
const mockedAddons = addons as Mocked<typeof addons>;

describe('a11yRunner', () => {
  let mockChannel: { on: Mock; emit?: Mock };

  beforeEach(() => {
    mockedAddons.getChannel.mockReset();

    mockChannel = { on: vi.fn(), emit: vi.fn() };
    mockedAddons.getChannel.mockReturnValue(mockChannel as any);
  });

  it('should listen to events', () => {
    // eslint-disable-next-line global-require
    require('./a11yRunner');

    expect(mockedAddons.getChannel).toHaveBeenCalled();
    expect(mockChannel.on).toHaveBeenCalledWith(EVENTS.REQUEST, expect.any(Function));
    expect(mockChannel.on).toHaveBeenCalledWith(EVENTS.MANUAL, expect.any(Function));
  });
});

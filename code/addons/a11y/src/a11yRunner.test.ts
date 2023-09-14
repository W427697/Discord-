import { addons } from '@storybook/preview-api';
import { EVENTS } from './constants';

vi.mock('@storybook/preview-api');
const mockedAddons = addons as vi.mocked<typeof addons>;

describe('a11yRunner', () => {
  let mockChannel: { on: vi.mock; emit?: vi.mock };

  beforeEach(() => {
    mockedAddons.getChannel.mockReset();

    mockChannel = { on: jest.fn(), emit: jest.fn() };
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

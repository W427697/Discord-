import * as api from '@storybook/manager-api';
import type { Addon_BaseType } from '@storybook/types';
import { PANEL_ID } from './constants';
import './manager';

jest.mock('@storybook/manager-api');
const mockedApi = api as unknown as jest.Mocked<api.API>;
mockedApi.getAddonState = jest.fn();
const mockedAddons = api.addons as jest.Mocked<typeof api.addons>;
const registrationImpl = mockedAddons.register.mock.calls[0][1];

const isPanel = (input: Parameters<typeof mockedAddons.add>[1]): input is Addon_BaseType =>
  input.type === api.types.PANEL;
describe('A11yManager', () => {
  it('should register the panels', () => {
    // when
    registrationImpl(mockedApi);

    // then
    expect(mockedAddons.add.mock.calls).toHaveLength(2);
    expect(mockedAddons.add).toHaveBeenCalledWith(PANEL_ID, expect.anything());

    const panel = mockedAddons.add.mock.calls
      .map(([_, def]) => def)
      .find(({ type }) => type === api.types.PANEL);
    const tool = mockedAddons.add.mock.calls
      .map(([_, def]) => def)
      .find(({ type }) => type === api.types.TOOL);
    expect(panel).toBeDefined();
    expect(tool).toBeDefined();
  });

  it('should compute title with no issues', () => {
    // given
    mockedApi.getAddonState.mockImplementation(() => undefined);
    registrationImpl(api as unknown as api.API);
    const title = mockedAddons.add.mock.calls.map(([_, def]) => def).find(isPanel)
      ?.title as Function;

    // when / then
    expect(title()).toBe('Accessibility');
  });

  it('should compute title with issues', () => {
    // given
    mockedApi.getAddonState.mockImplementation(() => ({ violations: [{}], incomplete: [{}, {}] }));
    registrationImpl(mockedApi);
    const title = mockedAddons.add.mock.calls.map(([_, def]) => def).find(isPanel)
      ?.title as Function;

    // when / then
    expect(title()).toBe('Accessibility (3)');
  });
});

import { themes } from '@storybook/theming';
import { defaultLayoutState, init as initLayout } from '../modules/layout';

let layoutApi;
let store;
let provider;
let currentState;

beforeEach(() => {
  currentState = {
    ...defaultLayoutState,
    selectedPanel: 'storybook/actions/panel',
    theme: themes.light,
    singleStory: false,
  };
  store = {
    getState: () => currentState,
    setState: jest.fn((patch) => {
      currentState = {
        ...currentState,
        ...(typeof patch === 'function' ? patch(currentState) : patch),
      };
    }),
  };
  provider = { getConfig: jest.fn(() => ({})) };
  layoutApi = initLayout({ store, provider }).api;
});

describe('layout API', () => {
  describe('toggleFullscreen', () => {
    it('should toggle fullscreen', () => {
      // start not in fullscreen
      expect(currentState.layout.navSize).toBeGreaterThan(0);
      expect(currentState.layout.bottomPanelHeight).toBeGreaterThan(0);
      expect(currentState.layout.rightPanelWidth).toBeGreaterThan(0);

      layoutApi.toggleFullscreen();

      // now in fullscreen
      expect(currentState.layout.navSize).toBe(0);
      expect(currentState.layout.bottomPanelHeight).toBe(0);
      expect(currentState.layout.rightPanelWidth).toBe(0);

      layoutApi.toggleFullscreen();

      // back to not in fullscreen
      expect(currentState.layout.navSize).toBeGreaterThan(0);
      expect(currentState.layout.bottomPanelHeight).toBeGreaterThan(0);
      expect(currentState.layout.rightPanelWidth).toBeGreaterThan(0);
    });

    it('should not show nav when disabling fullscreen with singleStory=true', () => {
      store.setState((current) => ({
        singleStory: true,
        layout: { ...current.layout, navSize: 0 },
      }));
      layoutApi = initLayout({ store, provider, singleStory: true }).api;

      // start not in fullscreen, nav hidden
      expect(currentState.layout.navSize).toBe(0);
      expect(currentState.layout.bottomPanelHeight).toBeGreaterThan(0);
      expect(currentState.layout.rightPanelWidth).toBeGreaterThan(0);

      layoutApi.toggleFullscreen();

      // now in fullscreen
      expect(currentState.layout.navSize).toBe(0);
      expect(currentState.layout.bottomPanelHeight).toBe(0);
      expect(currentState.layout.rightPanelWidth).toBe(0);

      layoutApi.toggleFullscreen();

      // back to not in fullscreen, nav still hidden
      expect(currentState.layout.navSize).toBe(0);
      expect(currentState.layout.bottomPanelHeight).toBeGreaterThan(0);
      expect(currentState.layout.rightPanelWidth).toBeGreaterThan(0);
    });
  });

  describe('toggleNav', () => {
    it('should toggle showNav', () => {
      currentState.layout.showNav = true;
      layoutApi.toggleNav();
      expect(currentState.layout.showNav).toBe(false);
      layoutApi.toggleNav();
      expect(currentState.layout.showNav).toBe(true);
      layoutApi.toggleNav(true);
      expect(currentState.layout.showNav).toBe(true);
      layoutApi.toggleNav(false);
      expect(currentState.layout.showNav).toBe(false);
    });

    describe('singleStory=true', () => {
      beforeEach(() => {
        layoutApi = initLayout({ store, provider, singleStory: true }).api;
      });

      it('should NOT toggle showNav', () => {
        currentState.layout.showNav = false;
        layoutApi.toggleNav();
        expect(currentState.layout.showNav).toBe(false);
        layoutApi.toggleNav(true);
        expect(currentState.layout.showNav).toBe(false);
      });
    });
  });

  describe('setOptions', () => {
    const getLastSetStateArgs = () => {
      const { calls } = store.setState.mock;
      return calls[calls.length - 1];
    };

    it('should not change selectedPanel if it is undefined in the options', () => {
      layoutApi.setOptions({});

      expect(getLastSetStateArgs()).toBeUndefined();
    });

    it('should not change selectedPanel if it is undefined in the options, but something else has changed', () => {
      layoutApi.setOptions({ panelPosition: 'right' });

      expect(getLastSetStateArgs()[0].selectedPanel).toBeUndefined();
    });

    it('should not change selectedPanel if it is currently the same', () => {
      const panelName = currentState.selectedPanel;
      layoutApi.setOptions({});
      // second call is needed to overwrite initial layout
      layoutApi.setOptions({ selectedPanel: panelName });

      expect(getLastSetStateArgs()).toBeUndefined();
    });

    it('should not change selectedPanel if it is currently the same, but something else has changed', () => {
      layoutApi.setOptions({});
      // second call is needed to overwrite initial layout
      layoutApi.setOptions({ panelPosition: 'right', selectedPanel: currentState.selectedPanel });

      expect(getLastSetStateArgs()[0].selectedPanel).toBeUndefined();
    });

    it('should set selectedPanel initially', () => {
      const panelName = 'storybook/a11y/panel';
      layoutApi.setOptions({ selectedPanel: panelName });

      expect(getLastSetStateArgs()[0].selectedPanel).toEqual(panelName);
    });

    it('should change selectedPanel if it is defined in the options and is different', () => {
      const panelName = 'storybook/a11y/panel';
      layoutApi.setOptions({});
      layoutApi.setOptions({ selectedPanel: panelName });

      expect(getLastSetStateArgs()[0].selectedPanel).toEqual(panelName);
    });
  });
});

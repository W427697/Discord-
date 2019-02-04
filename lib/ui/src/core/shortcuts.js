import { navigator, document } from 'global';
import { PREVIEW_KEYDOWN } from '@storybook/core-events';

import { shortcutMatchesShortcut, eventToShortcut } from '../libs/shortcut';
import { createSimpleKeybinding } from '../keyboard/keyCodes';
import { OS } from '../keyboard/platform';

export const isMacLike = () =>
  navigator && navigator.platform ? !!navigator.platform.match(/(Mac|iPhone|iPod|iPad)/i) : false;
export const controlOrMetaKey = () => (isMacLike() ? 'meta' : 'control');

// hash code to store keyboard shortcuts
// hash =  ctrl ? '1' : '0' , shiftKey ? '1' : '0', altKey ? '1' : '0', metaKey ? '1' : '0', keyCode
//  keycodes can be found in ./keyboard/keyCodes
export const defaultShortcuts = Object.freeze({
  fullScreen: '000036',
  togglePanel: '000049', // Panel visibiliy
  panelPosition: '000034',
  toggleNav: '000031',
  toolbar: '000050',
  search: '000085',
  focusNav: '000022',
  focusIframe: '000023',
  focusPanel: '000024',
  prevComponent: '001016',
  nextComponent: '001018',
  prevStory: '001015',
  nextStory: '001017',
  shortcutsPage: '010182',
  aboutPage: '000082',
  // // This one is not customizable
  escape: '00009',
});

export default function initShortcuts({ store }) {
  const api = {
    // Getting and setting shortcuts
    getShortcutKeys() {
      const shortcuts = Object.entries(store.getState().shortcuts).reduce(
        (acc, i) => ({ ...acc, [i[0]]: createSimpleKeybinding(`${i[1]}`, OS) }),
        {}
      );
      return shortcuts;
    },
    async setShortcuts(shortcuts) {
      await store.setState({ shortcuts }, { persistence: 'permanent' });
      return shortcuts;
    },
    async restoreAllDefaultShortcuts() {
      return api.setShortcuts(defaultShortcuts);
    },
    async setShortcut(action, value) {
      const shortcuts = api.getShortcutKeys();
      await api.setShortcuts({ ...shortcuts, [action]: value });
      return value;
    },
    async restoreDefaultShortcut(action) {
      const defaultShortcut = defaultShortcuts[action];
      return api.setShortcut(action, defaultShortcut);
    },

    // Listening to shortcut events
    handleKeydownEvent(fullApi, event) {
      const shortcut = eventToShortcut(event);
      const shortcuts = api.getShortcutKeys();
      const matchedFeature = Object.keys(shortcuts).find(feature =>
        shortcutMatchesShortcut(shortcut, shortcuts[feature])
      );
      if (matchedFeature) {
        return api.handleShortcutFeature(fullApi, matchedFeature);
      }
      return false;
    },

    handleShortcutFeature(fullApi, feature) {
      const {
        layout: { isFullscreen, showNav, showPanel },
      } = store.getState();

      switch (feature) {
        case 'escape': {
          if (isFullscreen) {
            fullApi.toggleFullscreen();
          } else if (!showNav) {
            fullApi.toggleNav();
          }
          document.activeElement.blur();
          break;
        }

        case 'focusNav': {
          if (isFullscreen) {
            fullApi.toggleFullscreen();
          }
          if (!showNav) {
            fullApi.toggleNav();
          }
          const element = document.getElementById('storybook-explorer-menu');

          if (element) {
            element.focus();
          }
          break;
        }

        case 'search': {
          if (isFullscreen) {
            fullApi.toggleFullscreen();
          }
          if (!showNav) {
            fullApi.toggleNav();
          }
          const element = document.getElementById('storybook-explorer-searchfield');

          if (element) {
            element.focus();
          }
          break;
        }

        case 'focusIframe': {
          const element = document.getElementById('storybook-preview-iframe');

          if (element) {
            try {
              // should be like a channel message and all that, but yolo for now
              element.contentWindow.focus();
            } catch (e) {
              //
            }
          }
          break;
        }

        case 'focusPanel': {
          if (isFullscreen) {
            fullApi.toggleFullscreen();
          }
          if (!showPanel) {
            fullApi.togglePanel();
          }
          const element = document.getElementById('storybook-panel-root');

          if (element) {
            element.focus();
          }
          break;
        }

        case 'nextStory': {
          fullApi.jumpToStory(1);
          break;
        }

        case 'prevStory': {
          fullApi.jumpToStory(-1);
          break;
        }

        case 'nextComponent': {
          fullApi.jumpToComponent(1);
          break;
        }

        case 'prevComponent': {
          fullApi.jumpToComponent(-1);
          break;
        }

        case 'fullScreen': {
          fullApi.toggleFullscreen();
          break;
        }

        case 'togglePanel': {
          if (isFullscreen) {
            fullApi.toggleFullscreen();
          }

          fullApi.togglePanel();
          break;
        }

        case 'toggleNav': {
          if (isFullscreen) {
            fullApi.toggleFullscreen();
          }

          fullApi.toggleNav();
          break;
        }

        case 'toolbar': {
          fullApi.toggleToolbar();
          break;
        }

        case 'panelPosition': {
          if (isFullscreen) {
            fullApi.toggleFullscreen();
          }
          if (!showPanel) {
            fullApi.togglePanel();
          }

          fullApi.togglePanelPosition();
          break;
        }

        case 'aboutPage': {
          fullApi.navigate('/settings/about');
          break;
        }

        case 'shortcutsPage': {
          fullApi.navigate('/settings/shortcuts');
          break;
        }

        default:
          break;
      }
    },
  };

  const { shortcuts: persistedShortcuts = {} } = store.getState();
  const state = {
    // Any saved shortcuts that are still in our set of defaults
    shortcuts: Object.keys(defaultShortcuts).reduce(
      (acc, key) => ({ ...acc, [key]: persistedShortcuts[key] || defaultShortcuts[key] }),
      {}
    ),
  };

  const init = ({ api: fullApi }) => {
    function focusInInput(event) {
      return (
        /input|textarea/i.test(event.target.tagName) ||
        event.target.getAttribute('contenteditable') !== null
      );
    }

    // Listen for keydown events in the manager
    document.addEventListener('keydown', event => {
      if (!focusInInput(event)) {
        fullApi.handleKeydownEvent(fullApi, event);
      }
    });

    // Also listen to keydown events sent over the channel
    fullApi.on(PREVIEW_KEYDOWN, data => {
      fullApi.handleKeydownEvent(fullApi, data.event);
    });
  };

  return { api, state, init };
}

import {
  TOGGLE_FULLSCREEN,
  TOGGLE_SHORTCUTSHELP,
  TOGGLE_SEARCHBOX,
  TOGGLE_LEFTPANEL,
  TOGGLE_DOWNPANEL,
  TOGGLE_DOWNPANEL_INRIGHT,
  TOGGLE_NEXT_STORY,
  TOGGLE_PREV_STORY,
} from './constants/actions';

export default [
  {
    key: '?',
    action: TOGGLE_SHORTCUTSHELP,
  },
  {
    key: ['mod+shift+f', 'ctrl+shift+f'],
    action: TOGGLE_FULLSCREEN,
  },
  {
    key: ['mod+shift+p', 'ctrl+shift+p'],
    action: TOGGLE_SEARCHBOX,
  },
  {
    key: ['mod+shift+l', 'ctrl+shift+l'],
    action: TOGGLE_LEFTPANEL,
  },
  {
    key: ['mod+shift+d', 'ctrl+shift+d'],
    action: TOGGLE_DOWNPANEL,
  },
  {
    key: ['mod+shift+j', 'ctrl+shift+j'],
    action: TOGGLE_DOWNPANEL_INRIGHT,
  },
  {
    key: ['mod+shift+right', 'ctrl+shift+right'],
    action: TOGGLE_NEXT_STORY,
  },
  {
    key: ['mod+shift+left', 'ctrl+shift+left'],
    action: TOGGLE_PREV_STORY,
  },
];

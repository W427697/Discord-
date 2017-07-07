import { TOGGLE_FULLSCREEN, TOGGLE_SHORTCUTSHELP, TOGGLE_SEARCHBOX } from './constants/actions';

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
    key: 'mod+shift+p',
    action: TOGGLE_SEARCHBOX,
  },
];

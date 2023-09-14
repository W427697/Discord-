import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  'addons/*',
  'frameworks/*',
  'lib/*',
  'deprecated/*',
  'builders/*',
  'ui/*',
  'presets/*',
  'renderers/*',
]);

const { describe, it } = global;
import { mapper } from './core_menu';

describe('manager.ui.containers.core_menu', () => {
  describe('mapper', () => {
    it('should give correct data', () => {
      const toggleShortcutsHelp = () => 'toggleShortcutsHelp';
      const handleEvent = () => 'handleEvent';

      const state = {
        selectedKind: 'aa',
        selectedStory: 'bb',
        shortcutOptions: { actions: 'cc' },
        emulShortcuts: handleEvent,
        openShortcutsHelp: toggleShortcutsHelp,
      };
      const props = {};
      const env = {
        actions: () => ({
          ui: {
            toggleShortcutsHelp,
          },
          shortcuts: {
            handleEvent,
          },
        }),
      };

      const data = mapper(state, props, env);
      expect(data).toEqual(state);
    });
  });
});

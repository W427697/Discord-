import { KeyCode, KeyMod, Keybinding, SimpleKeybinding, createSimpleKeybindingFromHashCode } from './keyCodes';
import { OperatingSystem } from './platform';

describe('KeyCodes', () => {
  describe('createSimpleKeybindingFromHashCode', () => {
    it('creates a new keybinding from a hash code', () => {
      const hash = '111136';
      const testKB = new SimpleKeybinding(true, true, true, true, 36);
      const kb = createSimpleKeybindingFromHashCode(hash);
      expect(kb.equals(testKB)).toBe(true);
    });
  });
});

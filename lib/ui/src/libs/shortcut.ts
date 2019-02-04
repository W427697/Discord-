import { navigator } from 'global';
import { KeyCodeUtils, SimpleKeybinding } from '../keyboard/keyCodes';
import { USLayoutResolvedKeybinding } from '../keyboard/usLayoutResolvedKeybinding';

import { OS } from '../keyboard/platform';
// The shortcut is our JSON-ifiable representation of a shortcut combination
type Shortcut = string[];

export const isMacLike = () => (navigator && navigator.platform ? !!navigator.platform.match(/(Mac|iPhone|iPod|iPad)/i) : false);
export const controlOrMetaSymbol = () => (isMacLike() ? '⌘' : 'ctrl');
export const controlOrMetaKey = () => (isMacLike() ? 'meta' : 'control');
export const optionOrAltSymbol = () => (isMacLike() ? '⌥' : 'alt');

export const isShortcutTaken = (kb1: SimpleKeybinding, kb2: SimpleKeybinding): boolean => kb1.getHashCode() === kb2.getHashCode();

// Map a keyboard event to a keyboard shortcut
// NOTE: if we change the fields on the event that we need, we'll need to update the serialization in core/preview/start.js
export const eventToShortcut = (e: KeyboardEvent): Shortcut | null => {
  // Meta key only doesn't map to a shortcut
  if (['Meta', 'Alt', 'Control', 'Shift'].includes(e.key)) {
    return null;
  }

  const keys = [];
  if (e.altKey) {
    keys.push('alt');
  }
  if (e.ctrlKey) {
    keys.push('control');
  }
  if (e.metaKey) {
    keys.push('meta');
  }
  if (e.shiftKey) {
    keys.push('shift');
  }

  if (e.key && e.key.length === 1 && e.key !== ' ') {
    keys.push(e.key.toUpperCase());
  }
  if (e.key === ' ') {
    keys.push('space');
  }
  if (e.key === 'Escape') {
    keys.push('escape');
  }
  if (e.key === 'ArrowRight') {
    keys.push('ArrowRight');
  }
  if (e.key === 'ArrowDown') {
    keys.push('ArrowDown');
  }
  if (e.key === 'ArrowUp') {
    keys.push('ArrowUp');
  }
  if (e.key === 'ArrowLeft') {
    keys.push('ArrowLeft');
  }

  return keys.length > 0 ? keys : null;
};

export const shortcutMatchesShortcut = (inputShortcut: Shortcut, shortcut: Shortcut): boolean => {
  return inputShortcut && inputShortcut.length === shortcut.length && !inputShortcut.find((key, i) => key !== shortcut[i]);
};

// Should this keyboard event trigger this keyboard shortcut?
export const eventMatchesShortcut = (e: KeyboardEvent, shortcut: Shortcut): boolean => {
  return shortcutMatchesShortcut(eventToShortcut(e), shortcut);
};

export const keyToSymbol = (key: string): string => {
  if (key === 'alt') {
    return optionOrAltSymbol();
  }
  if (key === 'control') {
    return '⌃';
  }
  if (key === 'meta') {
    return '⌘';
  }
  if (key === 'shift') {
    return '⇧​';
  }
  if (key === 'Enter' || key === 'Backspace' || key === 'Esc') {
    return '';
  }
  if (key === 'escape') {
    return '';
  }
  if (key === ' ') {
    return 'SPACE';
  }
  if (key === 'ArrowUp') {
    return '↑';
  }
  if (key === 'ArrowDown') {
    return '↓';
  }
  if (key === 'ArrowLeft') {
    return '←';
  }
  if (key === 'ArrowRight') {
    return '→';
  }
  return key.toUpperCase();
};

export const shortcutToHumanString = (skb: SimpleKeybinding) => {
  const kb = new USLayoutResolvedKeybinding(skb, OS);
  const kb1 = kb.getLabel()

  return kb1;
}

// Display the shortcut as a human readable string
export const hashCodeToSimpleKeybinding = (shortcut: string): SimpleKeybinding => {
  return new SimpleKeybinding(shortcut[0] === '1', shortcut[1] === '1', shortcut[2] === '1', shortcut[3] === '1', +shortcut.slice(-2));
};

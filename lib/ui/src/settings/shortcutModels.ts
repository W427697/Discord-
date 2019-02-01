import {ResolvedKeybinding } from '../keyboard/keyCodes';

export interface ParsedLocalStorageShortcutkeys {
	[k: string]: string
}

export interface ShortcutkeyState {
	[ k: string ]: {
		shortcut: ResolvedKeybinding;
		error: boolean;
	}
}


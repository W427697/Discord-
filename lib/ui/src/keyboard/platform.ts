import { navigator } from 'global';

export const _format = (message: any, args: any, env: any) => {
  let result;
  if (args.length === 0) {
    result = message;
  } else {
    result = message.replace(/\{(\d+)\}/g, (match: any, rest: any) => {
      let index = rest[0];
      let arg = args[index];
      let result = match;
      if (typeof arg === 'string') {
        result = arg;
      } else if (typeof arg === 'number' || typeof arg === 'boolean' || arg === undefined || arg === null) {
        result = String(arg);
      }
      return result;
    });
  }
  if (env.isPseudo) {
    // FF3B and FF3D is the Unicode zenkaku representation for [ and ]
    result = '\uFF3B' + result.replace(/[aouei]/g, '$&$&') + '\uFF3D';
  }
  return result;
};

function localize(env: unknown, data: unknown, message: unknown) {
  let args = [];
  for (let _i = 3; _i < arguments.length; _i++) {
    args[_i - 3] = arguments[_i];
  }
  return _format(message, args, env);
}

let _isWindows = false;
let _isMacintosh = false;
let _isLinux = false;
let _locale: string | undefined;
let _language: string | undefined;

export const enum Platform {
  Mac,
  Linux,
  Windows,
}

export const isWindows = _isWindows;
export const isMacintosh = _isMacintosh;
export const isLinux = _isLinux;

if (typeof navigator === 'object') {
  const userAgent = navigator.userAgent;
  _isWindows = userAgent.indexOf('Windows') >= 0;
  _isMacintosh = userAgent.indexOf('Macintosh') >= 0;
  _isLinux = userAgent.indexOf('Linux') >= 0;
  _locale = navigator.language;
  _language = _locale;
}

export const enum OperatingSystem {
  Windows = 1,
  Macintosh = 2,
  Linux = 3,
}

export const OS = _isMacintosh ? OperatingSystem.Macintosh : _isWindows ? OperatingSystem.Windows : OperatingSystem.Linux;

export interface ModifierLabels {
  readonly ctrlKey: string;
  readonly shiftKey: string;
  readonly altKey: string;
  readonly metaKey: string;
  readonly separator: string;
}

export interface Modifiers {
  readonly ctrlKey: boolean;
  readonly shiftKey: boolean;
  readonly altKey: boolean;
  readonly metaKey: boolean;
}

export class ModifierLabelProvider {
  public readonly modifierLabels: ModifierLabels[];

  constructor(mac: ModifierLabels, windows: ModifierLabels, linux: ModifierLabels = windows) {
    this.modifierLabels = [null!]; // index 0 will never me accessed.
    this.modifierLabels[OperatingSystem.Macintosh] = mac;
    this.modifierLabels[OperatingSystem.Windows] = windows;
    this.modifierLabels[OperatingSystem.Linux] = linux;
  }

  public toLabel(shortcutMod: Modifiers | null, shortcutKey: string | null, OS: OperatingSystem): string | null {
    if (shortcutMod === null || shortcutKey === null) {
      return null;
    }
    return _asString(shortcutMod, shortcutKey, this.modifierLabels[OS]);
  }
}

/**
 * A label provider that prints modifiers in a suitable format for displaying in the UI.
 */
export const UILabelProvider = new ModifierLabelProvider(
  {
    ctrlKey: '⌃',
    shiftKey: '⇧',
    altKey: '⌥',
    metaKey: '⌘',
    separator: '',
  },
  {
    ctrlKey: localize({ key: 'ctrlKey', comment: ['This is the short form for the Control key on the keyboard'] }, 'Ctrl', ''),
    shiftKey: localize({ key: 'shiftKey', comment: ['This is the short form for the Shift key on the keyboard'] }, 'Shift', ''),
    altKey: localize({ key: 'altKey', comment: ['This is the short form for the Alt key on the keyboard'] }, 'Alt', ''),
    metaKey: localize({ key: 'windowsKey', comment: ['This is the short form for the Windows key on the keyboard'] }, 'Windows', ''),
    separator: '+',
  },
  {
    ctrlKey: localize({ key: 'ctrlKey', comment: ['This is the short form for the Control key on the keyboard'] }, 'Ctrl', ''),
    shiftKey: localize({ key: 'shiftKey', comment: ['This is the short form for the Shift key on the keyboard'] }, 'Shift', ''),
    altKey: localize({ key: 'altKey', comment: ['This is the short form for the Alt key on the keyboard'] }, 'Alt', ''),
    metaKey: localize({ key: 'superKey', comment: ['This is the short form for the Super key on the keyboard'] }, 'Super', ''),
    separator: '+',
  }
);

/**
 * A label provider that prints modifiers in a suitable format for user settings.
 */
export const UserSettingsLabelProvider = new ModifierLabelProvider(
  {
    ctrlKey: 'ctrl',
    shiftKey: 'shift',
    altKey: 'alt',
    metaKey: 'cmd',
    separator: '+',
  },
  {
    ctrlKey: 'ctrl',
    shiftKey: 'shift',
    altKey: 'alt',
    metaKey: 'win',
    separator: '+',
  },
  {
    ctrlKey: 'ctrl',
    shiftKey: 'shift',
    altKey: 'alt',
    metaKey: 'meta',
    separator: '+',
  }
);

const _simpleAsString = (modifiers: Modifiers, key: string, labels: ModifierLabels): string => {
  if (key === null) {
    return '';
  }

  let result: string[] = [];

  // translate modifier keys: Ctrl-Shift-Alt-Meta
  if (modifiers.ctrlKey) {
    result.push(labels.ctrlKey);
  }

  if (modifiers.shiftKey) {
    result.push(labels.shiftKey);
  }

  if (modifiers.altKey) {
    result.push(labels.altKey);
  }

  if (modifiers.metaKey) {
    result.push(labels.metaKey);
  }

  // the actual key
  result.push(key);

  return result.join(labels.separator);
};

function _asString(shortcutMod: Modifiers, shortcutKey: string, labels: ModifierLabels): string {
  let result = _simpleAsString(shortcutMod, shortcutKey, labels);

  return result;
}

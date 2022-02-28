import global from 'global';
import { shortcutToHumanString } from '@storybook/api/shortcut';
import { STORY_SPECIFIED } from '@storybook/core-events';
import { ModuleFn } from '..';

const { document } = global;

export interface SubState {
  palette: {
    isOpen: boolean;
    commands?: any[];
  };
}

export interface SubAPI {
  closeCommandPalette: () => void;
  openCommandPalette: () => void;
  toggleCommandPalette: () => void;
  executeCommand: (commandId: string, payload?: any) => void;
}

export const init: ModuleFn = ({ fullAPI, store }) => {
  const createCommandPalette = (commands: any[]) => {
    const Palette = document.getElementById('storybook-command-palette');
    // clear palette
    Palette.innerHTML = `<ul style="
      background: white;
      padding: 0.5rem 0;
      width: 100%;
      list-style: none;
      display: grid;
      gap: 10px;
      border-radius: 12px;
    "></ul>`;

    const createCommand = (command: any) => {
      const Command = document.createElement('li');
      Command.style.padding = '0.5rem';
      Command.style.cursor = 'pointer';
      Command.style['border-bottom'] = '1px solid #cccccc70';

      Command.onclick = () => fullAPI.executeCommand(command.id);
      Command.innerHTML = `
        <span>${command.title}</span>
        <span>[${command.shortcut}]</span>
      `;

      return Command;
    };

    commands.forEach((cmd) => {
      Palette.firstChild.appendChild(createCommand(cmd));
    });
  };

  const api: SubAPI = {
    closeCommandPalette: () => {
      console.log('closing palette');
      document.getElementById('storybook-command-palette').style.display = 'none';
      const { palette } = store.getState();
      store.setState({ palette: { ...palette, isOpen: false } });
    },
    openCommandPalette: () => {
      console.log('opening palette');
      document.getElementById('storybook-command-palette').style.display = 'flex';
      const { palette } = store.getState();
      store.setState({ palette: { ...palette, isOpen: true } });
    },
    toggleCommandPalette: () => {
      const { palette } = store.getState();
      console.log('toggling palette', palette);
      if (palette.isOpen) {
        fullAPI.closeCommandPalette();
      } else {
        fullAPI.openCommandPalette();
      }
    },
    executeCommand: (id) => {
      const {
        palette: { commands },
      } = store.getState();

      const commandToExecute = commands.find((cmd) => cmd.id === id);
      if (commandToExecute) {
        console.log('executing command ', id);
        commandToExecute.execute();
        fullAPI.closeCommandPalette();
      } else {
        console.warn(`Tried to execute command with id ${id} but couldn't!`);
      }
    },
  };

  const mapAddonsShortcuts = () => {
    const addonsShortcuts = fullAPI.getAddonsShortcuts();
    const commands = Object.entries(addonsShortcuts).map(
      ([actionName, { label, action, defaultShortcut }]) => ({
        id: actionName,
        title: label,
        execute: () => action(),
        shortcut: shortcutToHumanString(defaultShortcut),
      })
    );
    const state = store.getState();

    console.log('setting palette commands...', commands);
    store.setState({
      palette: {
        ...state.palette,
        commands,
      },
    });
    createCommandPalette(commands);
  };

  const initModule = async () => {
    // could be useful?
    // const shortcuts = fullAPI.getDefaultShortcuts();
    const state = store.getState();
    store.setState({
      palette: {
        ...state.palette,
        commands: [],
      },
    });

    // Very likely there is a better event to listen to
    fullAPI.on(STORY_SPECIFIED, () => {
      mapAddonsShortcuts();
    });
  };

  return {
    api,
    state: {
      palette: {
        isOpen: false,
        commands: [],
      },
    },
    init: initModule,
  };
};

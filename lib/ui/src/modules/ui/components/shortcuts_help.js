import PropTypes from 'prop-types';
import React from 'react';
import styled from 'react-emotion';

const Command = styled('b')(
  ({ isLast, isFirst, theme }) => {
    switch (true) {
      case isFirst && isLast: {
        return {
          borderRight: '0 none',
          borderRadius: 2,
          marginRight: 0,
        };
      }
      case isFirst: {
        return {
          borderRight: theme.mainBorder,
          borderRadius: `${theme.mainBorderRadius} 0 0 ${theme.mainBorderRadius}`,
          marginRight: 0,
        };
      }
      case isLast: {
        return {
          borderRight: '0 none',
          borderRadius: `0 ${theme.mainBorderRadius} ${theme.mainBorderRadius} 0`,
          marginRight: 9,
        };
      }
      default: {
        return {
          borderRight: '0 none',
          borderRadius: 0,
          marginRight: 9,
        };
      }
    }
  },
  ({ theme }) => ({
    padding: '2px 10px',
    backgroundColor: theme.inputFill,
    color: 'inherit',
    lineHeight: '36px',
    minWidth: 50,
    display: 'inline-block',
    textAlign: 'center',
  })
);

const Table = styled('table')({
  borderCollapse: 'collapse',
});

const CommandDescription = styled('span')({
  fontSize: 12,
  color: 'inherit',
});

// manage two separate shortcut keys for
// 'mac' & other (windows, linux) platforms
export function getShortcuts(platform) {
  // if it is mac platform
  if (platform && platform.indexOf('mac') !== -1) {
    return [
      { name: 'Show Search Box', keys: ['⌘ ⇧ O', '⌃ ⇧ O'] },
      { name: 'Toggle Addon panel position', keys: ['⌘ ⇧ G', '⌃ ⇧ G'] },
      { name: 'Toggle Fullscreen Mode', keys: ['⌘ ⇧ F', '⌃ ⇧ F'] },
      { name: 'Toggle Stories Panel', keys: ['⌘ ⇧ X', '⌃ ⇧ X'] },
      { name: 'Toggle Addon panel', keys: ['⌘ ⇧ Z', '⌃ ⇧ Z'] },
      { name: 'Next Story', keys: ['⌘ ⇧ →', '⌃ ⇧ →'] },
      { name: 'Previous Story', keys: ['⌘ ⇧ ←', '⌃ ⇧ ←'] },
    ];
  }

  return [
    { name: 'Show Search Box', keys: ['Ctrl + Shift + O'] },
    { name: 'Toggle Addon panel position', keys: ['Ctrl + Shift + G'] },
    { name: 'Toggle Fullscreen Mode', keys: ['Ctrl + Shift + F'] },
    { name: 'Toggle Stories Panel', keys: ['Ctrl + Shift + X'] },
    { name: 'Toggle Addon panel', keys: ['Ctrl + Shift + Z'] },
    { name: 'Next Story', keys: ['Ctrl + Shift + →'] },
    { name: 'Previous Story', keys: ['Ctrl + Shift + ←'] },
  ];
}

export const Keys = ({ shortcutKeys }) => (
  <span>
    {shortcutKeys.map((key, index, arr) => (
      <Command key={key} isLast={arr.length - 1 === index} isFirst={index === 0}>
        {key}
      </Command>
    ))}
  </span>
);

Keys.propTypes = {
  shortcutKeys: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export const Shortcuts = ({ appShortcuts }) => (
  <Table>
    <tbody>
      {appShortcuts.map(shortcut => (
        <tr key={shortcut.name}>
          <td>
            <Keys shortcutKeys={shortcut.keys} />
          </td>
          <td>
            <CommandDescription>{shortcut.name}</CommandDescription>
          </td>
        </tr>
      ))}
    </tbody>
  </Table>
);

Shortcuts.propTypes = {
  appShortcuts: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      keys: PropTypes.array,
    })
  ).isRequired,
};

const ShortcutsHelp = ({ platform }) => <Shortcuts appShortcuts={getShortcuts(platform)} />;

ShortcutsHelp.propTypes = {
  platform: PropTypes.string.isRequired,
};
ShortcutsHelp.defaultProps = {
  isOpen: false,
  onClose: () => {},
};

export { ShortcutsHelp as default };

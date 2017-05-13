const { describe, it, beforeEach } = global;
import React from 'react';
import { shallow } from 'enzyme';
import Menu from './floating_block.js';
import CoreMenu from './';
import { colorScheme } from '../theme';
import { boxPositions } from '../../../../libs/menu_positions';
import { features } from '../../../../libs/key_events';

describe('manager.ui.components.core_menu.floating_block', () => {
  it('should have theme based background color', () => {
    const wrap = shallow(<Menu />);
    const root = wrap.find('div').first();
    expect(root.props().style.backgroundColor).toEqual(colorScheme.block);
  });

  it('should have the right position', () => {
    const wrap = shallow(<Menu position={boxPositions.BOTTOM_RIGHT} />);
    const root = wrap.find('div').first();
    expect(root.props().style.right).toEqual(10);
    expect(root.props().style.bottom).toEqual(20);
  });
});

describe('manager.ui.components.core_menu', () => {
  describe('should fire api callbacks when clicked on shortcut buttons:', () => {
    let emulShortcuts = jest.fn();
    let openShortcutsHelp = jest.fn();
    let wrap;

    beforeEach(() => {
      emulShortcuts = jest.fn();
      openShortcutsHelp = jest.fn();
      wrap = shallow(
        <CoreMenu
          emulShortcuts={emulShortcuts}
          openShortcutsHelp={openShortcutsHelp}
          shortcutOptions={{}}
        />,
      );
    });

    it('features.FULLSCREEN', () => {
      const button = wrap.find('div.floating-menu-button').at(0);
      button.simulate('click');
      expect(emulShortcuts.mock.calls[0]).toEqual([features.FULLSCREEN]);
    });

    it('features.DOWN_PANEL', () => {
      const button = wrap.find('div.floating-menu-button').at(1);
      button.simulate('click');
      expect(emulShortcuts.mock.calls[0]).toEqual([features.DOWN_PANEL]);
    });

    it('features.LEFT_PANEL', () => {
      const button = wrap.find('div.floating-menu-button').at(2);
      button.simulate('click');
      expect(emulShortcuts.mock.calls[0]).toEqual([features.LEFT_PANEL]);
    });

    it('features.DOWN_PANEL_IN_RIGHT', () => {
      const button = wrap.find('div.floating-menu-button').at(3);
      button.simulate('click');
      expect(emulShortcuts.mock.calls[0]).toEqual([features.DOWN_PANEL_IN_RIGHT]);
    });

    it('features.SEARCH', () => {
      const button = wrap.find('div.floating-menu-button').at(4);
      //      console.log(button.props())
      button.simulate('click');
      expect(emulShortcuts.mock.calls[0]).toEqual([features.SEARCH]);
    });

    it('Open Shortcuts Help', () => {
      const button = wrap.find('div.floating-menu-button').last();
      button.simulate('click');
      expect(openShortcutsHelp.mock.calls.length).toEqual(1);
    });
  });
});

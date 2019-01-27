import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { styled, keyframes } from '@storybook/theming';
import { GlobalHotKeys } from 'react-hotkeys';

import { Form, IconButton, Icons, Tabs } from '@storybook/components';
import SettingsFooter from './SettingsFooter';

import { OS } from '../keyboard/platform';
// import {KeybindingParser} from '../keyboard/keybindingParser'
import { eventToShortcut, shortcutToHumanString, shortcutMatchesShortcut } from '../libs/shortcut';
import { USLayoutResolvedKeybinding } from '../keyboard/usLayoutResolvedKeybinding';
import { KeyCode, KeyCodeUtils, SimpleKeybinding } from '../keyboard/keyCodes';
import { StandardKeyboardEvent } from '../keyboard/keyboardEvent'
import {
  A,
  Button,
  ColWrapper,
  Container,
  Description,
  Footer,
  GridHeaderRow,
  GridWrapper,
  Heading,
  Header,
  HeaderItem,
  HotKeyWrapper,
  KeyInputWrapper,
  Main,
  Row,
  SuccessIcon,
  TextInput,
  Title,
  TitleText,
  Wrapper,
} from './components';

const shortcutLabels = {
  fullScreen: 'Go full screen',
  togglePanel: 'Toggle addons',
  panelPosition: 'Toggle addons orientation',
  toggleNav: 'Toggle sidebar',
  toolbar: 'Toggle canvas toolbar',
  search: 'Focus search',
  focusNav: 'Focus sidebar',
  focusIframe: 'Focus canvas',
  focusPanel: 'Focus addons',
  prevComponent: 'Previous component',
  nextComponent: 'Next component',
  prevStory: 'Previous story',
  nextStory: 'Next story',
  shortcutsPage: 'Go to shortcuts page',
  aboutPage: 'Go to about page',
};

// Shortcuts that cannot be configured
const fixedShortcuts = ['escape'];
const mapShortcut = shortcut => {
  return shortcut
}

// feature name: shortcut is key compbo
function toShortcutState(shortcutKeys) {
  console.log('shortcutKeys: ', shortcutKeys);
  return Object.entries(shortcutKeys).reduce(
    (acc, [feature, shortcut]) =>
      fixedShortcuts.includes(feature) ? acc : { ...acc, [feature]: { shortcut:mapShortcut(shortcut) , error: false } },
    {}
  );
}

const keyMap = {
  CLOSE: 'escape',
};

class ShortcutsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeFeature: '',
      successField: '',
      // The initial shortcutKeys that come from props are the defaults/what was saved
      // As the user interacts with the page, the state stores the temporary, unsaved shortcuts
      // This object also includes the error attached to each shortcut
      shortcutKeys: toShortcutState(props.shortcutKeys),
    };

    console.log('props', props)
  }


  resolveUSKeybinding = (kb) => {
    console.log('[new USLayoutResolvedKeybinding(kb, OS)]: ', new USLayoutResolvedKeybinding(kb, OS));
    return new USLayoutResolvedKeybinding(kb, OS);
  }

  resolveKeyboardEvent = ( keyboardEvent ) => {
    const keybinding = new SimpleKeybinding(
      keyboardEvent.ctrlKey,
      keyboardEvent.shiftKey,
      keyboardEvent.altKey,
      keyboardEvent.metaKey,
      keyboardEvent.keyCode )
    return this.resolveUSKeybinding(keybinding)
  }

  onKeyDown = e => {
    const evt = new StandardKeyboardEvent(e)

    // const info = `code: ${evt.code}, keyCode: ${evt.keyCode}, user settings: ${keybinding.getUserSettingsLabel()}, dispatch: ${keybinding.getLabel()}`;
    const { activeFeature, shortcutKeys } = this.state;

    if (KeyCodeUtils.toString(evt.keyCode) === 'Backspace') {
      return this.restoreDefault();
    }
    const kb = new SimpleKeybinding( evt.ctrlKey,
      evt.shiftKey,
      evt.altKey,
      evt.metaKey,
      evt.keyCode)
    const keybinding = this.resolveKeyboardEvent(evt)
    console.log('keybinding: ', keybinding);
    // console.log('keyparser.parseKeybinding(hash, OS): ', keyparser.parseKeybinding(hash, OS));
    // Keypress is not a potential shortcut
    console.log('keybining: ', keybinding);
    if (!keybinding) {
      return false;
    }

    // existingShortcut: ['B', 'A']
    // feature i.e fullScreen
    // Check we don't match any other shortucts
    const error = !!Object.entries(e.key).find(
      ([feature, { shortcut: existingShortcut }]) => {
        return feature !== activeFeature &&
        existingShortcut &&
        shortcutMatchesShortcut(e.key, existingShortcut)
      }
    );

    return this.setState({
      shortcutKeys: { ...shortcutKeys, [activeFeature]: { keybinding, error } },
    }, console.log(this.state.shortcutKeys.fullScreen));
  };

  onFocus = focusedInput => () => {
    const { shortcutKeys } = this.state;

    this.setState({
      activeFeature: focusedInput,
      shortcutKeys: { ...shortcutKeys, [focusedInput]: { shortcut: null, error: false } },
    });
  };

  onBlur = async () => {
    const { shortcutKeys, activeFeature } = this.state;

    if (shortcutKeys[activeFeature]) {
      const { shortcut, error } = shortcutKeys[activeFeature];
      if (!shortcut || error) {
        return this.restoreDefault();
      }
      return this.saveShortcut();
    }
    return false;
  };

  saveShortcut = async () => {
    const { activeFeature, shortcutKeys } = this.state;

    const { setShortcut } = this.props;
    await setShortcut(activeFeature, shortcutKeys[activeFeature].shortcut);
    this.setState({ successField: activeFeature });
  };

  restoreDefaults = async () => {
    const { restoreAllDefaultShortcuts } = this.props;

    const defaultShortcuts = await restoreAllDefaultShortcuts();
    return this.setState({ shortcutKeys: toShortcutState(defaultShortcuts) });
  };

  restoreDefault = async () => {
    const { activeFeature, shortcutKeys } = this.state;

    const { restoreDefaultShortcut } = this.props;

    const defaultShortcut = await restoreDefaultShortcut(activeFeature);
    return this.setState({
      shortcutKeys: {
        ...shortcutKeys,
        ...toShortcutState({ [activeFeature]: defaultShortcut }),
      },
    });
  };

  displaySuccessMessage = activeElement => {
    const { successField, shortcutKeys } = this.state;
    return activeElement === successField && shortcutKeys[activeElement].error === false
      ? 'valid'
      : '';
  };

  displayError = activeElement => {
    const { activeFeature, shortcutKeys } = this.state;
    return activeElement === activeFeature && shortcutKeys[activeElement].error === true
      ? 'error'
      : '';
  };

  renderKeyInput = () => {
    const { shortcutKeys } = this.state;
    const arr = Object.entries(shortcutKeys).map(([feature, { shortcut }]) => (
      <Row key={feature}>
        <Description>{shortcutLabels[feature]}</Description>

        <TextInput
          spellCheck="false"
          valid={this.displayError(feature)}
          className="modalInput"
          onBlur={this.onBlur}
          onFocus={this.onFocus(feature)}
          onKeyDown={this.onKeyDown}
          value={shortcut ? shortcutToHumanString(shortcut) : ''}
          placeholder="Type keys"
          readOnly
        />

        <SuccessIcon valid={this.displaySuccessMessage(feature)} icon="check" />
      </Row>
    ));

    return arr;
  };

  renderKeyForm = () => (
    <GridWrapper>
      <GridHeaderRow>
        <HeaderItem>Commands</HeaderItem>
        <HeaderItem>Shortcut</HeaderItem>
      </GridHeaderRow>
      {this.renderKeyInput()}
    </GridWrapper>
  );

  render() {
    const { onClose } = this.props;
    const layout = this.renderKeyForm();
    return (
      <GlobalHotKeys handlers={{ CLOSE: onClose }} keyMap={keyMap}>
        <Tabs
          absolute
          selected="shortcuts"
          actions={{ onSelect: () => {} }}
          tools={
            <Fragment>
              <IconButton
                onClick={e => {
                  e.preventDefault();
                  return onClose();
                }}
              >
                <Icons icon="close" />
              </IconButton>
            </Fragment>
          }
        >
          <div id="shortcuts" title="Keyboard Shortcuts">
            <Container>
              <Header>Keyboard shortcuts</Header>

              {layout}
              <Button tertiary small id="restoreDefaultsHotkeys" onClick={this.restoreDefaults}>
                Restore defaults
              </Button>

              <SettingsFooter />
            </Container>
          </div>
        </Tabs>
      </GlobalHotKeys>
    );
  }
}

ShortcutsScreen.propTypes = {
  shortcutKeys: PropTypes.shape({}).isRequired, // Need TS for this
  setShortcut: PropTypes.func.isRequired,
  restoreDefaultShortcut: PropTypes.func.isRequired,
  restoreAllDefaultShortcuts: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ShortcutsScreen;

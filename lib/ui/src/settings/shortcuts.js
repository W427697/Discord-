import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { GlobalHotKeys } from 'react-hotkeys';
import { IconButton, Icons, Tabs } from '@storybook/components';
import { shortcutToHumanString } from '../libs/shortcut';
import { SimpleKeybinding } from '../keyboard/keyCodes';
import { StandardKeyboardEvent } from '../keyboard/keyboardEvent';
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
  togglePanel: 'Toggle panel',
  panelPosition: 'Toggle panel position',
  toggleNav: 'Toggle navigation',
  toolbar: 'Toggle toolbar',
  search: 'Focus search',
  focusNav: 'Focus navigation',
  focusIframe: 'Focus iFrame',
  focusPanel: 'Focus panel',
  prevComponent: 'Previous component',
  nextComponent: 'Next component',
  prevStory: 'Previous story',
  nextStory: 'Next story',
  shortcutsPage: 'Go to shortcuts page',
  aboutPage: 'Go to about page',
};

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
      shortcutKeys: props.shortcutKeys,
    };
  }

  keyboardEventoSimpleBinding = keyboardEvent =>
    new SimpleKeybinding(
      keyboardEvent.ctrlKey,
      keyboardEvent.shiftKey,
      keyboardEvent.altKey,
      keyboardEvent.metaKey,
      keyboardEvent.keyCode
    );

  isBlackListedKey = evt => {
    if (evt.code === 'Escape') {
      return true;
    }
    if (evt.code === 'Enter' || evt.code === 'Tab') {
      this.onBlur();
      return true;
    }
    if (evt.code === 'Backspace') {
      this.restoreDefault();
      return true;
    }

    return false;
  };

  onKeyDown = e => {
    const evt = new StandardKeyboardEvent(e);
    const { activeFeature, shortcutKeys } = this.state;

    // some keys have special actions and cannot be used
    // as modifiers
    if (!this.isBlackListedKey(evt)) {
      const shortcut = this.keyboardEventoSimpleBinding(evt);

      // Keypress is not a potential shortcut
      if (!shortcut) {
        return false;
      }

      // existingShortcut: SimpleKeybinding
      // feature i.e fullScreen
      // Check we don't match any other shortucts,
      // convert to hash string for easy comparison
      const error = !!Object.entries(shortcutKeys).find(
        ([feature, { shortcut: existingShortcut }]) =>
          existingShortcut &&
          feature !== activeFeature &&
          existingShortcut.getHashCode() === shortcut.getHashCode()
      );

      return this.setState({
        shortcutKeys: { ...shortcutKeys, [activeFeature]: { shortcut, error } },
      });
    }
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

    const { shortcut, error } = shortcutKeys[activeFeature];
    if (!shortcut || error) {
      this.restoreDefault();
    }
    return this.saveShortcut();
  };

  saveShortcut = async () => {
    const { activeFeature, shortcutKeys } = this.state;
    const { setShortcut } = this.props;

    await setShortcut(activeFeature, shortcutKeys[activeFeature].shortcut.getHashCode());
    this.setState({ successField: activeFeature });
  };

  restoreDefaults = async () => {
    const { restoreAllDefaultShortcuts } = this.props;
    const defaultShortcuts = await restoreAllDefaultShortcuts();
    this.setState({ shortcutKeys: defaultShortcuts });
  };

  restoreDefault = async () => {
    const { activeFeature, shortcutKeys } = this.state;

    const { restoreDefaultShortcut } = this.props;

    const defaultShortcut = await restoreDefaultShortcut(activeFeature);

    this.setState({
      shortcutKeys: {
        ...shortcutKeys,
        [activeFeature]: {
          error: false,
          shortcut: defaultShortcut,
        },
      },
    });
    this.saveShortcut();
  };

  displaySuccessMessage = activeElement => {
    const { successField, shortcutKeys } = this.state;
    return activeElement === successField && shortcutKeys[activeElement].error === false
      ? 'success'
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

    return Object.entries(shortcutKeys).map(([feature, { shortcut }]) => (
      <Row key={feature}>
        <Description>{shortcutLabels[feature]}</Description>
        <KeyInputWrapper>
          <HotKeyWrapper>
            <TextInput
              spellCheck="false"
              colorTheme={this.displayError(feature)}
              className="modalInput"
              onBlur={this.onBlur}
              onFocus={this.onFocus(feature)}
              onKeyDown={this.onKeyDown}
              value={shortcut ? shortcutToHumanString(shortcut) : ''}
              readOnly
            />
          </HotKeyWrapper>
        </KeyInputWrapper>

        <SuccessIcon colorTheme={this.displaySuccessMessage(feature)}>
          <Icons height={20} icon="check" />
        </SuccessIcon>
      </Row>
    ));
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
              <Wrapper>
                <Title>
                  <TitleText>Keyboard Shortcuts</TitleText>
                </Title>
              </Wrapper>
              <ColWrapper>
                <Main>
                  <Heading>
                    <Header>
                      <Button id="restoreDefaultsHotkeys" onClick={this.restoreDefaults}>
                        Restore Defaults
                      </Button>
                    </Header>
                  </Heading>
                  {layout}
                </Main>
              </ColWrapper>
              <Wrapper>
                <Footer>
                  <A href="https://storybook.js.org">Storybook docs</A>
                  <A href="https://github.com/storybooks/storybook">GitHub</A>
                  <A href="https://storybook.js.org/support">Support</A>
                </Footer>
              </Wrapper>
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

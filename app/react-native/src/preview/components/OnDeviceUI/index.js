import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ifIphoneX } from 'react-native-iphone-x-helper';

import { Dimensions, View, TouchableOpacity, Text } from 'react-native';
import Events from '@storybook/core-events';
import style from './style';
import StoryListView from '../StoryListView';
import StoryView from '../StoryView';

/**
 * Returns true if the screen is in portrait mode
 */
const isDeviceInPortrait = () => {
  const dim = Dimensions.get('screen');
  return dim.height >= dim.width;
};

const DRAWER_WIDTH = 250;

export default class OnDeviceUI extends Component {
  constructor(...args) {
    super(...args);

    this.state = {
      isUIVisible: true,
      isMenuOpen: false,
      selectedKind: null,
      selectedStory: null,
      isPortrait: isDeviceInPortrait(),
    };
  }

  componentDidMount() {
    Dimensions.addEventListener('change', this.handleDeviceRotation);
    this.props.events.on(Events.SELECT_STORY, this.handleStoryChange);
  }

  componentWillUnmount() {
    Dimensions.removeEventListener('change', this.handleDeviceRotation);
    this.props.events.removeListener(Events.SELECT_STORY, this.handleStoryChange);
  }

  handleDeviceRotation = () => {
    this.setState({
      isPortrait: isDeviceInPortrait(),
    });
  };

  handleStoryChange = selection => {
    const { kind, story } = selection;
    this.setState({
      selectedKind: kind,
      selectedStory: story,
    });
  };

  handleToggleMenu = () => {
    this.setState({
      isMenuOpen: !this.state.isMenuOpen,
    });
  };

  handleToggleUI = () => {
    this.setState({
      isUIVisible: !this.state.isUIVisible,
    });
  };

  renderVisibilityButton = () => (
    <TouchableOpacity
      onPress={this.handleToggleUI}
      testID="Storybook.OnDeviceUI.toggleUI"
      accessibilityLabel="Storybook.OnDeviceUI.toggleUI"
      style={style.hideButton}
    >
      <Text style={style.text}>o</Text>
    </TouchableOpacity>
  );

  render() {
    const { stories, events, url } = this.props;
    const { isPortrait, isMenuOpen, selectedKind, selectedStory, isUIVisible } = this.state;

    const iPhoneXStyles = ifIphoneX(
      isPortrait
        ? {
            marginVertical: 30,
          }
        : {
            marginHorizontal: 30,
          },
      {}
    );

    const menuStyles = [
      style.menuContainer,
      {
        transform: [
          {
            translateX: isMenuOpen ? 0 : -DRAWER_WIDTH - 30,
          },
        ],
      },
      iPhoneXStyles,
    ];

    const previewContainerStyles = [style.previewContainer, iPhoneXStyles];

    const previewWrapperStyles = [style.previewWrapper, iPhoneXStyles];

    return (
      <View style={style.main}>
        <View style={previewContainerStyles}>
          {isUIVisible ? (
            <View style={style.headerContainer}>
              <TouchableOpacity
                onPress={this.handleToggleMenu}
                testID="Storybook.OnDeviceUI.open"
                accessibilityLabel="Storybook.OnDeviceUI.open"
              >
                <View>
                  <Text style={style.text}>List</Text>
                </View>
              </TouchableOpacity>
              {this.renderVisibilityButton()}
            </View>
          ) : null}
          <View style={previewWrapperStyles}>
            <View style={style.preview}>
              <StoryView url={url} events={events} />
            </View>
          </View>
          {!isUIVisible ? this.renderVisibilityButton() : null}
        </View>
        <View style={menuStyles}>
          <TouchableOpacity
            onPress={this.handleToggleMenu}
            testID="Storybook.OnDeviceUI.close"
            accessibilityLabel="Storybook.OnDeviceUI.close"
          >
            <View>
              <Text style={style.closeButton}>x</Text>
            </View>
          </TouchableOpacity>
          <StoryListView
            stories={stories}
            events={events}
            width={DRAWER_WIDTH}
            selectedKind={selectedKind}
            selectedStory={selectedStory}
          />
        </View>
      </View>
    );
  }
}

OnDeviceUI.propTypes = {
  stories: PropTypes.shape({
    dumpStoryBook: PropTypes.func.isRequired,
    on: PropTypes.func.isRequired,
    emit: PropTypes.func.isRequired,
    removeListener: PropTypes.func.isRequired,
  }).isRequired,
  events: PropTypes.shape({
    on: PropTypes.func.isRequired,
    emit: PropTypes.func.isRequired,
    removeListener: PropTypes.func.isRequired,
  }).isRequired,
  url: PropTypes.string,
};

OnDeviceUI.defaultProps = {
  url: '',
};

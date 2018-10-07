import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  SafeAreaView,
  Platform,
  Keyboard,
  Dimensions,
  View,
  Animated,
  TouchableOpacity,
  Text,
} from 'react-native';
import addons from '@storybook/addons';
import Events from '@storybook/core-events';
import style from './style';
import StoryListView from '../StoryListView';
import StoryView from '../StoryView';
import Addons from './addons';
import Bar from './tabs/bar';
import Panel from './tabs/panel';

const ANIMATION_DURATION = 300;
const PREVIEW_SCALE = 0.3;

const panelWidth = width => width * (1 - PREVIEW_SCALE - 0.05);

export default class OnDeviceUI extends PureComponent {
  constructor(props) {
    super(props);

    addons.loadAddons({});
    this.panels = addons.getPanels();

    const tabOpen = props.tabOpen || 0;

    this.state = {
      isUIVisible: !props.isUIHidden,
      tabOpen,
      slideBetweenAnimation: false,
      selection: props.initialStory || {},
      storyFn: props.initialStory ? props.initialStory.storyFn : null,
      addonSelected: Object.keys(this.panels)[0] || null,
      previewWidth: 0,
      previewHeight: 0,
    };

    this.animatedValue = new Animated.Value(tabOpen);
    this.forceRender = this.forceUpdate.bind(this);
  }

  componentWillMount() {
    const { events } = this.props;
    events.on(Events.SELECT_STORY, this.handleStoryChange);
    events.on(Events.FORCE_RE_RENDER, this.forceRender);

    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide);
    Dimensions.addEventListener('change', this.removeKeyboardOnOrientationChange);
  }

  componentWillUnmount() {
    const { events } = this.props;
    events.removeListener(Events.SELECT_STORY, this.handleStoryChange);
    events.removeListener(Events.FORCE_RE_RENDER, this.forceRender);

    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
    Dimensions.removeEventListener('change', this.removeKeyboardOnOrientationChange);
  }

  keyboardDidShow = e => {
    // There is bug in RN that it calles this method if you simply go from portrait to landscape.
    // So we enable keyboard check only when keyboard actually opens
    if (Platform.OS === 'android') {
      const { previewWidth } = this.state;
      if (previewWidth === e.endCoordinates.width) {
        this.keyboardOpen = true;
      }
    }
  };

  // When rotating screen from portrait to landscape with keyboard open on android it calls keyboardDidShow, but doesn't call
  // keyboardDidhide. To avoid issues we set keyboardOpen to false imediatelly on keyboardChange
  removeKeyboardOnOrientationChange = () => {
    if (Platform.OS === 'android') {
      this.keyboardOpen = false;
    }
  };

  keyboardDidHide = () => {
    if (this.keyboardOpen) {
      this.keyboardOpen = false;
    }
  };

  handlePressAddon = addonSelected => {
    this.setState({ addonSelected });
  };

  handleStoryChange = selection => {
    this.setState({
      selection: {
        kind: selection.kind,
        story: selection.story,
      },
      storyFn: selection.storyFn,
    });
  };

  handleToggleTab = newTabOpen => {
    const { tabOpen } = this.state;

    if (newTabOpen === tabOpen) {
      return;
    }

    Animated.timing(this.animatedValue, {
      toValue: newTabOpen,
      duration: ANIMATION_DURATION,
    }).start();

    this.setState({
      tabOpen: newTabOpen,
      slideBetweenAnimation: tabOpen + newTabOpen === 0,
    });
  };

  handleToggleUI = () => {
    const { isUIVisible } = this.state;

    this.setState({ isUIVisible: !isUIVisible });
  };

  renderVisibilityButton = () => (
    <TouchableOpacity
      onPress={this.handleToggleUI}
      testID="Storybook.OnDeviceUI.toggleUI"
      accessibilityLabel="Storybook.OnDeviceUI.toggleUI"
      style={style.hideButton}
    >
      <Text style={[style.hideButtonText]}>o</Text>
    </TouchableOpacity>
  );

  render() {
    const { stories, events, url } = this.props;
    const {
      tabOpen,
      slideBetweenAnimation,
      selection,
      storyFn,
      isUIVisible,
      addonSelected,
      previewWidth,
      previewHeight,
    } = this.state;

    const { width: screenWidth } = Dimensions.get('screen');

    const menuStyles = [
      {
        transform: [
          {
            translateX: this.animatedValue.interpolate({
              inputRange: [-1, 0],
              outputRange: [0, -panelWidth(screenWidth)],
            }),
          },
        ],
        width: panelWidth(screenWidth),
      },
    ];

    const addonMenuStyles = [
      {
        transform: [
          {
            translateX: this.animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [screenWidth, screenWidth - panelWidth(screenWidth)],
            }),
          },
        ],
        width: panelWidth(screenWidth),
      },
    ];

    const scale = {
      transform: [
        {
          scale: this.animatedValue.interpolate({
            inputRange: [-1, 0, 1],
            outputRange: [PREVIEW_SCALE, slideBetweenAnimation ? PREVIEW_SCALE : 1, PREVIEW_SCALE],
          }),
        },
      ],
    };

    const previewStyles = [style.preview, tabOpen !== 0 && style.previewMinimized, scale];

    const translateX = previewWidth / 2 - (previewWidth * PREVIEW_SCALE) / 2 - 6;
    const translateY = -(previewHeight / 2 - (previewHeight * PREVIEW_SCALE) / 2 - 12);

    const position = {
      transform: [
        {
          translateX: this.animatedValue.interpolate({
            inputRange: [-1, 0, 1],
            outputRange: [translateX, 0, -translateX],
          }),
        },
        {
          translateY: this.animatedValue.interpolate({
            inputRange: [-1, 0, 1],
            outputRange: [translateY, slideBetweenAnimation ? translateY : 0, translateY],
          }),
        },
      ],
    };

    const previewWrapperStyles = [style.flex, position];

    return (
      <SafeAreaView style={style.main}>
        <View
          style={{ flex: 1 }}
          onLayout={({
            nativeEvent: {
              layout: { width, height },
            },
          }) => {
            if (!this.keyboardOpen) {
              this.setState({
                previewHeight: height,
                previewWidth: width,
              });
            }
          }}
        >
          <View
            style={
              previewWidth === 0
                ? { flex: 1 }
                : { position: 'absolute', width: previewWidth, height: previewHeight }
            }
          >
            <Animated.View style={previewWrapperStyles}>
              <Animated.View style={previewStyles}>
                <StoryView url={url} events={events} selection={selection} storyFn={storyFn} />
              </Animated.View>
            </Animated.View>
          </View>
          <Panel style={menuStyles}>
            <StoryListView
              stories={stories}
              events={events}
              selectedKind={selection.kind}
              selectedStory={selection.story}
            />
          </Panel>
          <Panel style={addonMenuStyles}>
            <Addons
              onPressAddon={this.handlePressAddon}
              addonSelected={addonSelected}
              panels={this.panels}
            />
          </Panel>
        </View>
        <View>
          {isUIVisible && <Bar index={tabOpen} onPress={this.handleToggleTab} />}
          {this.renderVisibilityButton()}
        </View>
      </SafeAreaView>
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
  tabOpen: PropTypes.number,
  isUIHidden: PropTypes.bool,
  initialStory: PropTypes.shape({
    story: PropTypes.string.isRequired,
    kind: PropTypes.string.isRequired,
    storyFn: PropTypes.func.isRequired,
  }),
};

OnDeviceUI.defaultProps = {
  url: '',
  tabOpen: 0,
  isUIHidden: false,
  initialStory: null,
};

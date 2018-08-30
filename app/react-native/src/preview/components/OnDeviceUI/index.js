import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { SafeAreaView, Dimensions, View, Animated, TouchableOpacity, Text } from 'react-native';
import addons from '@storybook/addons';
import Events from '@storybook/core-events';
import style from './style';
import StoryListView from '../StoryListView';
import StoryView from '../StoryView';
import AddonsList from './addons/list';
import AddonWrapper from './addons/wrapper';
import Bar from './tabs/bar';
import Panel from './tabs/panel';

const ANIMATION_DURATION = 300;
const PREVIEW_SCALE = 0.3;

const panelWidth = () => Dimensions.get('screen').width * (1 - PREVIEW_SCALE - 0.05);

export default class OnDeviceUI extends PureComponent {
  constructor(props) {
    super(props);

    addons.loadAddons();
    this.panels = addons.getPanels();

    const tabOpen = props.tabOpen || 0;

    this.state = {
      isUIVisible: !props.isUIHidden,
      tabOpen,
      slideBetweenAnimation: false,
      selectedKind: null,
      selectedStory: null,
      addonSelected: Object.keys(this.panels)[0] || null,
    };

    this.animatedValue = new Animated.Value(tabOpen);
  }

  componentDidMount() {
    const { events } = this.props;
    events.on(Events.SELECT_STORY, this.handleStoryChange);
  }

  componentWillUnmount() {
    const { events } = this.props;
    events.removeListener(Events.SELECT_STORY, this.handleStoryChange);
  }

  handlePressAddon = addonSelected => {
    this.setState({ addonSelected });
  };

  handleStoryChange = selection => {
    const { kind, story } = selection;
    this.setState({
      selectedKind: kind,
      selectedStory: story,
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
      selectedKind,
      selectedStory,
      isUIVisible,
      addonSelected,
    } = this.state;

    const { width, height } = Dimensions.get('screen');

    const menuStyles = [
      {
        transform: [
          {
            translateX: this.animatedValue.interpolate({
              inputRange: [-1, 0],
              outputRange: [0, -panelWidth()],
            }),
          },
        ],
        width: panelWidth(),
      },
    ];

    const addonMenuStyles = [
      {
        transform: [
          {
            translateX: this.animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [width, width - panelWidth()],
            }),
          },
        ],
        width: panelWidth(),
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

    const translateX = width / 2 - (width * PREVIEW_SCALE) / 2 - 6;
    const translateY = -(height / 2 - (height * PREVIEW_SCALE) / 2 - 30);

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
        <View style={style.flex}>
          <Animated.View style={previewWrapperStyles}>
            <Animated.View style={previewStyles}>
              <StoryView url={url} events={events} />
            </Animated.View>
          </Animated.View>
        </View>
        <Panel style={menuStyles}>
          <StoryListView
            stories={stories}
            events={events}
            selectedKind={selectedKind}
            selectedStory={selectedStory}
          />
        </Panel>
        <Panel style={[addonMenuStyles]}>
          <AddonsList
            onPressAddon={this.handlePressAddon}
            panels={this.panels}
            addonSelected={addonSelected}
          />
          <AddonWrapper addonSelected={addonSelected} panels={this.panels} />
        </Panel>
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
};

OnDeviceUI.defaultProps = {
  url: '',
  tabOpen: 0,
  isUIHidden: false,
};

import React, { Component } from 'react';
import { View, Text } from 'react-native';

import { addons } from '@storybook/addons';
import styled from '@emotion/native';

import { SELECT_STORY, FORCE_RE_RENDER } from '@storybook/core-events';

interface Props {
  listenToEvents: boolean;
  selection?: any;
  storyFn?: any;
  url: string;
}

interface State {
  storyFn?: any;
  selection?: any;
}

const HelpContainer = styled.View`
  flex: 1;
  padding-horizontal: 15;
  padding-vertical: 15;
  align-items: center;
  justify-content: center;
`;

export default class StoryView extends Component<Props, State> {
  componentDidMount() {
    if (this.props.listenToEvents) {
      const channel = addons.getChannel();
      channel.on(SELECT_STORY, this.selectStory);
      channel.on(FORCE_RE_RENDER, this.forceReRender);
    }
  }

  componentWillUnmount() {
    const { listenToEvents } = this.props;

    if (listenToEvents) {
      const channel = addons.getChannel();
      channel.removeListener(SELECT_STORY, this.selectStory);
      channel.removeListener(FORCE_RE_RENDER, this.forceReRender);
    }
  }

  forceReRender = () => {
    this.forceUpdate();
  };

  selectStory = (selection: any) => {
    this.setState({ storyFn: selection.storyFn, selection });
  };

  renderHelp = () => {
    const { url } = this.props;
    return (
      <HelpContainer>
        {url && url.length ? (
          <Text>
            Please open the Storybook UI ({url}) with a web browser and select a story for preview.
          </Text>
        ) : (
          <Text>
            Please open the Storybook UI with a web browser and select a story for preview.
          </Text>
        )}
      </HelpContainer>
    );
  };

  renderOnDeviceUIHelp = () => (
    <HelpContainer>
      <Text>Please open navigator and select a story to preview.</Text>
    </HelpContainer>
  );

  render() {
    const { listenToEvents } = this.props;

    if (listenToEvents) {
      return this.renderListening();
    } else {
      return this.renderOnDevice();
    }
  }

  renderListening = () => {
    if (!this.state) {
      return null;
    }
    const { storyFn, selection } = this.state;
    const { kind, story } = selection;

    return storyFn ? (
      <View key={`${kind}:::${story}`} style={{ flex: 1 }}>
        {storyFn()}
      </View>
    ) : (
      this.renderHelp()
    );
  };

  renderOnDevice = () => {
    const { storyFn, selection } = this.props;
    const { kind, story } = selection;

    return storyFn ? (
      <View key={`${kind}:::${story}`} style={{ flex: 1 }}>
        {storyFn()}
      </View>
    ) : (
      this.renderOnDeviceUIHelp()
    );
  };
}

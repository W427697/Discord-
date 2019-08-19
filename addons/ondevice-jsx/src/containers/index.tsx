import React from 'react';
import { addons } from '@storybook/addons';

import JSXComponent from '../components';
import { EVENT_ID } from '../consts';

interface State {
  storySource: string;
}

export default class JSX extends React.PureComponent<{}, State> {
  readonly state: State = {
    storySource: '',
  };

  componentDidMount() {
    const channel = addons.getChannel();

    channel.on(EVENT_ID, this.onStorySourceReceived);
  }

  componentWillUnmount() {
    const channel = addons.getChannel();
    channel.removeListener(EVENT_ID, this.onStorySourceReceived);
  }

  onStorySourceReceived = ({ storySource }: { storySource: string }) => {
    this.setState({
      storySource,
    });
  };

  render() {
    const { storySource } = this.state;

    return <JSXComponent storySource={storySource} />;
  }
}

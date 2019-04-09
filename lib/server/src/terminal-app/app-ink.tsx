import React, { Component } from 'react';
import { Static, render, Box, Text } from 'ink';

import Boxed from 'ink-box';
import Gradient from 'ink-gradient';
import BigText from 'ink-big-text';

import { progress } from '@storybook/node-logger';

interface State {
  server: string;
  manager: string;
}

interface Props {
  activities: {
    server: () => Promise<any>;
    manager: () => Promise<any>;
  };
}

class App extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const reporter = (type: 'server' | 'manager') => ({
      message,
      progress,
    }: {
      message: string;
      progress?: number;
    }) => {
      this.setState({ [type]: message + ' ' + progress || '' });
    };

    Object.entries(props.activities).map(([type, init]) => {
      progress.subscribe(type, reporter(type));
      init();
    });

    this.state = {
      server: 'uninitialized',
      manager: 'uninitialized',
    };
  }

  render() {
    return (
      <Box width="100%" height="100%" flexDirection="row">
        <Box width="100%">
          <Boxed borderStyle="round" borderColor="cyan" float="left" padding={1}>
            <Box flexDirection="row">
              <Box>server: {this.state.server}</Box>
              <Box>manager: {this.state.manager}</Box>
            </Box>
          </Boxed>
        </Box>
      </Box>
    );
  }
}

export const run = (activities: Props['activities']) => {
  render(<App activities={activities} />);
};

// setTimeout(() => {
//   // Enough counting
//   terminal.unmount();
// }, 1000);

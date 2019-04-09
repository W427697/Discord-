import React, { Component } from 'react';
import blessed from 'blessed';
import { render } from 'react-blessed';

import { progress } from '@storybook/node-logger';

import { DebouncedDashboard } from './dashboard';

interface State {
  server: {
    message: string;
    progress?: number;
  };
  manager: {
    message: string;
    progress?: number;
  };
  preview: {
    message: string;
    progress?: number;
  };
}

interface Props {
  activities: {
    server: () => Promise<any>;
    manager: () => Promise<any>;
    preview: () => Promise<any>;
  };
}

// Rendering a simple centered box
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
      this.setState({
        [type]: {
          message,
          progress,
        },
      });
    };

    Object.entries(props.activities).map(([type, init]) => {
      progress.subscribe(type, reporter(type));
      init();
    });

    this.state = {
      server: { message: 'uninitialized', progress: 0 },
      manager: { message: 'uninitialized', progress: 0 },
      preview: { message: '', progress: 0 },
    };
  }

  render() {
    return <DebouncedDashboard {...this.state} />;
  }
}

// Creating our screen
const screen = blessed.screen({
  autoPadding: true,
  smartCSR: true,
  title: 'react-blessed hello world',
});

// Adding a way to quit the program
// screen.key(['escape', 'q', 'C-c'], (ch, key) => {
//   return process.exit(0);
// });

// Rendering the React app using our screen

export const run = (activities: Props['activities']) => {
  render(<App activities={activities} />, screen);
};

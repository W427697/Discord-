import React, { Component } from 'react';
import blessed from 'blessed';
import { render } from 'react-blessed';
import { progress as progressChannel } from '@storybook/node-logger';
import { ProgressDescription, State, ValidStateKeys } from '../types';

import { DebouncedDashboard } from './dashboard';

interface Props {
  activities: {
    server: () => Promise<any>;
    manager: () => Promise<any>;
    preview: () => Promise<any>;
  };
}

// Rendering a simple centered box
class App extends Component<Props, Partial<State>> {
  constructor(props: Props) {
    super(props);

    const reporter = (type: ValidStateKeys) => ({ message, progress }: ProgressDescription) => {
      this.setState({
        [type]: {
          message,
          progress,
        },
      });
    };

    Object.entries(props.activities).forEach(([t, init]) => {
      const type = t as ValidStateKeys;
      progressChannel.subscribe(type, reporter(type));
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

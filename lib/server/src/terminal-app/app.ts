import React, { Component } from 'react';
import { render, Box } from 'ink';

interface State {
  i: number;
}

class Counter extends Component<any, State> {
  constructor(props: {}) {
    super(props);

    this.state = {
      i: 0,
    };
  }

  timer: NodeJS.Timeout | undefined;
  state: State;

  render() {
    return React.createElement(Box, {}, `Iteration ${this.state.i}`);
  }

  componentDidMount() {
    this.timer = setInterval(() => {
      this.setState(prevState => ({
        i: prevState.i + 1,
      }));
    }, 100);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }
}

// const terminal = render(React.createElement(Counter, null, {}));

// setTimeout(() => {
//   // Enough counting
//   terminal.unmount();
// }, 1000);

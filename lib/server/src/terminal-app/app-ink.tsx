import React, { Component, Fragment } from 'react';
import { Static, render, Box, Text, Color } from 'ink';
import EventEmitter from 'eventemitter3';

import { ProgressDescription, State, ValidStateKeys } from '../types';
import { logo } from '../banner/banner';

interface Props {
  activities: {
    server: () => EventEmitter;
    manager: () => EventEmitter;
    preview: () => EventEmitter;
  };
}

const reporter = (type: ValidStateKeys, ctx: Component<Props, Partial<State>>) => ({
  message,
  progress,
}: ProgressDescription) => {
  ctx.setState({
    [type]: {
      message,
      progress,
    },
  });
};

class App extends Component<Props, Partial<State>> {
  constructor(props: Props) {
    super(props);

    Object.entries(props.activities).forEach(([t, init]) => {
      const type = t as ValidStateKeys;
      const emitter = init();
      emitter.on('progress', reporter(type, this));
    });

    this.state = {
      server: { message: 'starting', progress: 0 },
      manager: { message: 'starting', progress: 0 },
      preview: { message: 'starting', progress: 0 },
    };
  }

  render() {
    const { server, manager, preview } = this.state;

    return (
      <Fragment>
        <Static>
          <Text key="logo">{logo}</Text>
          {server.progress === 100 ? (
            <Box marginBottom={1} key="server">
              Server <Color green>OK</Color>
            </Box>
          ) : null}
          {manager.progress === 100 ? (
            <Box marginBottom={1} key="manager">
              Manager <Color green>OK</Color>
            </Box>
          ) : null}
          {preview.progress === 100 ? (
            <Box marginBottom={1} key="preview">
              Preview <Color green>OK</Color>
            </Box>
          ) : null}
        </Static>
        <Box>{JSON.stringify(this.state)}</Box>
        <Box flexDirection="column">
          {server.progress < 100 ? (
            <Box marginBottom={1} key="server">
              Server: {server.progress} - {server.message}
            </Box>
          ) : null}
          {manager.progress < 100 ? (
            <Box marginBottom={1} key="manager">
              Manager: {manager.progress} - {manager.message}
            </Box>
          ) : null}
          {preview.progress < 100 ? (
            <Box marginBottom={1} key="preview">
              Preview: {preview.progress} - {preview.message}
            </Box>
          ) : null}
        </Box>
      </Fragment>
    );
  }
}

export const run = (activities: Props['activities']) => {
  render(<App activities={activities} />);
};

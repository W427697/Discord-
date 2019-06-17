import React, { Component, Fragment } from 'react';
import { Static, render, Box, Text, Color } from 'ink';
import EventEmitter from 'eventemitter3';
import Spinner from 'ink-spinner';

import { ProgressDescription, State, ValidStateKeys } from '../types';
import { Banner } from '../banner/banner';

import accepts = require('accepts');

interface Props {
  activities: {
    [name: string]: () => EventEmitter;
  };
}

const reporter = (type: string, ctx: Component<Props, Partial<State>>) => ({
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

const useScreenWidth = () => {
  return process.stdout.columns || 90;
};

const IncompletedItem = ({
  title,
  percentage,
  message: content,
  extra,
}: {
  title: string;
  percentage: number;
  message: string;
  extra: string;
}) => {
  const l0 = useScreenWidth() - title.length - extra.length - 4;
  const pad = Array(l0)
    .fill(' ')
    .join('');
  const l1 = Math.ceil(l0 * (percentage / 100));
  const l2 = l0 - l1;

  const message = ` ${content} `;

  return (
    <Box>
      <Spinner type="dots" /> <Color blue>{title}</Color>{' '}
      <Color black bgHex="#1EA7FD">
        {message.concat(pad).slice(0, l1)}
      </Color>
      <Color gray bgHex="#000">
        {message
          .slice(l1)
          .concat(pad)
          .slice(0, l2)}
      </Color>
      <Color gray> {extra}</Color>
    </Box>
  );
};

class App extends Component<Props, Partial<State>> {
  constructor(props: Props) {
    super(props);

    Object.entries(props.activities).forEach(([type, init]) => {
      init().on('progress', reporter(type, this));
    });

    this.state = Object.keys(props.activities).reduce((acc, k) => {
      return { ...accepts, [k]: { message: 'starting', progress: 0 } };
    }, {});
  }

  render() {
    const activities = Object.entries(this.state);
    const completed = activities.filter(([k, v]) => v.progress === 100);
    const progress = activities.filter(([k, v]) => v.progress < 100);

    return (
      <Fragment>
        <Static>
          <Box marginBottom={1} key="header">
            <Banner />
          </Box>
          {completed.length ? (
            <Box>
              <Color blue>Completed</Color>
            </Box>
          ) : null}
          {completed.map(([k, v]) => {
            return (
              <Box>
                {k} <Color green>OK</Color> - <Color gray>{v.message}</Color>
              </Box>
            );
          })}
        </Static>
        <Box marginBottom={1} />
        <Box flexDirection="column">
          {progress.length ? (
            <Box>
              <Color blue>In progress</Color>
            </Box>
          ) : null}
          {progress.map(([k, v]) => {
            return (
              <IncompletedItem
                key={k}
                title={k}
                message={v.message}
                percentage={v.progress}
                extra={`${v.progress.toString()}%`}
              />
            );
          })}
        </Box>
      </Fragment>
    );
  }
}

export const run = (activities: Props['activities']) => {
  render(<App activities={activities} />);
};

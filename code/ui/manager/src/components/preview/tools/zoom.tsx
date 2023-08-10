import type { SyntheticEvent, MouseEventHandler } from 'react';
import React, { Component, useCallback } from 'react';

import { IconButton, Toolbar } from '@storybook/components/experimental';
import type { Addon_BaseType } from '@storybook/types';
import { types } from '@storybook/manager-api';

const initialZoom = 1 as const;

const Context = React.createContext({ value: initialZoom, set: (v: number) => {} });

class ZoomProvider extends Component<{ shouldScale: boolean }, { value: number }> {
  state = {
    value: initialZoom,
  };

  set = (value: number) => this.setState({ value });

  render() {
    const { children, shouldScale } = this.props;
    const { set } = this;
    const { value } = this.state;
    return (
      <Context.Provider value={{ value: shouldScale ? value : initialZoom, set }}>
        {children}
      </Context.Provider>
    );
  }
}

const { Consumer: ZoomConsumer } = Context;

const Zoom = React.memo<{
  zoomIn: MouseEventHandler;
  zoomOut: MouseEventHandler;
  reset: MouseEventHandler;
}>(function Zoom({ zoomIn, zoomOut, reset }) {
  return (
    <>
      <IconButton
        key="zoomin"
        title="Zoom in"
        icon="Zoom"
        size="small"
        variant="ghost"
        onClick={zoomIn}
      />
      <IconButton
        key="zoomout"
        title="Zoom out"
        icon="ZoomOut"
        size="small"
        variant="ghost"
        onClick={zoomOut}
      />
      <IconButton
        key="zoomreset"
        title="Reset zoom"
        icon="ZoomReset"
        size="small"
        variant="ghost"
        onClick={reset}
      />
    </>
  );
});

export { Zoom, ZoomConsumer, ZoomProvider };

const ZoomWrapper = React.memo<{ set: (zoomLevel: number) => void; value: number }>(
  function ZoomWrapper({ set, value }) {
    const zoomIn = useCallback(
      (e: SyntheticEvent) => {
        e.preventDefault();
        set(0.8 * value);
      },
      [set, value]
    );
    const zoomOut = useCallback(
      (e: SyntheticEvent) => {
        e.preventDefault();
        set(1.25 * value);
      },
      [set, value]
    );
    const reset = useCallback(
      (e) => {
        e.preventDefault();
        set(initialZoom);
      },
      [set, initialZoom]
    );
    return <Zoom key="zoom" {...{ zoomIn, zoomOut, reset }} />;
  }
);

export const zoomTool: Addon_BaseType = {
  title: 'zoom',
  id: 'zoom',
  type: types.TOOL,
  match: ({ viewMode }) => viewMode === 'story',
  render: React.memo(function ZoomToolRenderer() {
    return (
      <>
        <ZoomConsumer>{({ set, value }) => <ZoomWrapper {...{ set, value }} />}</ZoomConsumer>
        <Toolbar.Separator />
      </>
    );
  }),
};

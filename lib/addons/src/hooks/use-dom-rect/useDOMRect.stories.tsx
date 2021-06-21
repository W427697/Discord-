import { Meta } from '@storybook/react';
import React from 'react';
import { useDOMRect as useDOMRectHook } from './useDOMRect';

export default {
  title: 'Lib/Addons/hooks/UseDOMRect',
  parameters: {
    actions: { disable: true },
    controls: { disable: true },
    test: { disable: true },
  },
} as Meta;

export const Default = () => {
  const {
    ref,
    DOMRect: { width, height, left, right, top, bottom, x, y },
  } = useDOMRectHook();

  return (
    <div ref={ref} style={{ border: '1px solid #cccccc', padding: 32 }}>
      <h2>No options will give a static object of values as they are on mount</h2>
      <p>You can slide the width of the menu/canvas to change size of div</p>
      <div>{`width: ${width}px`}</div>
      <div>{`height: ${height}px`}</div>
      <div>{`left: ${left}px`}</div>
      <div>{`right: ${right}px`}</div>
      <div>{`top: ${top}px`}</div>
      <div>{`bottom: ${bottom}px`}</div>
      <div>{`x: ${x}px`}</div>
      <div>{`y: ${y}px`}</div>
    </div>
  );
};

export const Live = () => {
  const {
    ref,
    DOMRect: { width, height, left, right, top, bottom, x, y },
  } = useDOMRectHook({ live: true });

  return (
    <div ref={ref} style={{ border: '1px solid #cccccc', padding: 32 }}>
      <h2>Set live to true and you will be get an update anytime a value changes</h2>
      <p>You can slide the width of the menu/canvas to change size of div</p>
      <div>{`width: ${width}px`}</div>
      <div>{`height: ${height}px`}</div>
      <div>{`left: ${left}px`}</div>
      <div>{`right: ${right}px`}</div>
      <div>{`top: ${top}px`}</div>
      <div>{`bottom: ${bottom}px`}</div>
      <div>{`x: ${x}px`}</div>
      <div>{`y: ${y}px`}</div>
    </div>
  );
};

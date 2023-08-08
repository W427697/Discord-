import type { FC } from 'react';
import React from 'react';
import { styled } from '@storybook/theming';

export const RainbowContainer = styled.div({
  background: 'red',
});

export const RainbowLine = styled.div<{ bgColor: string }>(({ bgColor }) => ({
  background: bgColor,
  height: 64,
}));

interface TestComponentProps {
  color?: 'yellow' | 'blue';
}

export const TestComponent: FC<TestComponentProps> = ({ color = 'yellow' }) => {
  const yellowColors = [
    '#ffd54f',
    '#fec236',
    '#fcae1e',
    '#ec9716',
    '#db7911',
    '#d1690e',
    '#b2560d',
    '#9d4807',
    '#893901',
    '#802e03',
    '#782205',
    '#701806',
    '#680c07',
    '#5b0907',
    '#4e0707',
    '#470706',
    '#400706',
    '#390603',
    '#350301',
    '#330000',
  ];

  const blueColors = [
    '#f2f2ff',
    '#e6e6ff',
    '#d9d9ff',
    '#ccccff',
    '#bfbfff',
    '#b3b3ff',
    '#a6a6ff',
    '#9999ff',
    '#8c8cff',
    '#8080ff',
    '#7373ff',
    '#6666ff',
    '#5959ff',
    '#4d4dff',
    '#4040ff',
    '#3333ff',
    '#2626ff',
    '#1919ff',
    '#0d0dff',
    '#0000ff',
  ];

  const colors = color === 'yellow' ? yellowColors : blueColors;

  const reverseColors = [...colors].reverse();
  const joinedColors = [...colors, ...reverseColors];

  return (
    <RainbowContainer>
      {joinedColors.map((c) => (
        <RainbowLine key={Math.random()} bgColor={c} />
      ))}
    </RainbowContainer>
  );
};

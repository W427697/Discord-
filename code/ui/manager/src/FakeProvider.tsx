import React from 'react';
import { styled } from '@storybook/theming';
import { addons } from '@storybook/manager-api';
import Provider from './provider';

export class FakeProvider extends Provider {
  constructor() {
    super();

    // @ts-expect-error (Converted from ts-ignore)
    this.addons = addons;
    // @ts-expect-error (Converted from ts-ignore)
    this.channel = {
      on: () => {},
      once: () => {},
      off: () => {},
      emit: () => {},
      addListener: () => {},
      removeListener: () => {},
    };
  }

  // @ts-expect-error (Converted from ts-ignore)
  getElements(type) {
    return addons.getElements(type);
  }

  renderPreview() {
    return <div>This is from a 'renderPreview' call from FakeProvider</div>;
  }

  // @ts-expect-error (Converted from ts-ignore)
  handleAPI(api) {
    addons.loadAddons(api);
  }

  getConfig() {
    return {};
  }
}

export const Centered = styled.div({
  width: '100vw',
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
});

export class PrettyFakeProvider extends FakeProvider {
  renderPreview(...args: any[]) {
    return (
      <Centered>
        This is from a 'renderPreview' call from FakeProvider
        <hr />
        'renderPreview' was called with:
        <pre>{JSON.stringify(args, null, 2)}</pre>
      </Centered>
    );
  }
}

export const RainbowContainer = styled.div({
  background: 'red',
});

export const RainbowLine = styled.div<{ bgColor: string }>(({ bgColor }) => ({
  background: bgColor,
  height: 64,
}));

const colors = [
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

const reverseColors = [...colors].reverse();
const joinedColors = [...colors, ...reverseColors];

export class RainbowFakeProvider extends FakeProvider {
  renderPreview(...args: any[]) {
    return (
      <RainbowContainer>
        {joinedColors.map((color, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <RainbowLine key={index} bgColor={color} />
        ))}
      </RainbowContainer>
    );
  }
}

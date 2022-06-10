import React, { FunctionComponent } from 'react';
import { transparentize } from 'polished';
import { styled } from '@storybook/theming';
import { ResetWrapper } from '@storybook/components';
import { Box, Stack, Text } from '../primitives';
import { Block } from '.';

const SwatchLabel = styled.div(({ theme }) => ({
  flex: 1,
  textAlign: 'center',
  fontFamily: theme.typography.fonts.mono,
  fontSize: theme.typography.size.s1,
  lineHeight: 1,
  overflow: 'hidden',
  color:
    theme.base === 'light'
      ? transparentize(0.4, theme.color.defaultText)
      : transparentize(0.6, theme.color.defaultText),

  '> div': {
    display: 'inline-block',
    overflow: 'hidden',
    maxWidth: '100%',
    textOverflow: 'ellipsis',
  },

  span: {
    display: 'block',
    marginTop: 2,
  },
}));

const SwatchLabels = styled.div({
  display: 'flex',
  flexDirection: 'row',
});

interface SwatchProps {
  background: string;
}

const Swatch: React.FC<SwatchProps> = ({ background }) => (
  <Box
    css={{
      flexGrow: 1,
      height: '50px',
    }}
    style={{ background }}
  />
);

const SwatchColors: React.FC = ({ children }) => (
  <Block>
    <Stack
      orientation="horizontal"
      css={{
        backgroundImage: `repeating-linear-gradient(-45deg, #ccc, #ccc 1px, #fff 1px, #fff 16px)`,
        backgroundClip: 'padding-box',
        overflow: 'hidden',
      }}
    >
      {children}
    </Stack>
  </Block>
);

const SwatchSpecimen: React.FC = (props) => (
  <Stack
    gap="medium"
    css={{
      flexGrow: 1,
    }}
    {...props}
  />
);

const Swatches = styled.div({
  flex: 1,
  display: 'flex',
  flexDirection: 'row',
});

const Item = styled.div({
  display: 'flex',
  alignItems: 'flex-start',
});

const ListName = styled.div({
  flex: '0 0 30%',
});

const ListSwatches = styled.div({
  flex: 1,
});

const ListHeading = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  paddingBottom: 20,
  fontWeight: theme.typography.weight.bold,
  color:
    theme.base === 'light'
      ? transparentize(0.4, theme.color.defaultText)
      : transparentize(0.6, theme.color.defaultText),
}));

const List = styled.div(({ theme }) => ({
  fontSize: theme.typography.size.s2,
  lineHeight: `20px`,

  display: 'flex',
  flexDirection: 'column',
}));

type Colors = string[] | { [key: string]: string };

interface ColorItemProps {
  title: string;
  subtitle: string;
  colors: Colors;
}

function renderSwatch(color: string, index: number) {
  return <Swatch key={`${color}-${index}`} title={color} background={color} />;
}

function renderSwatchLabel(color: string, index: number, colorDescription?: string) {
  return (
    <SwatchLabel key={`${color}-${index}`} title={color}>
      <div>
        {color}
        {colorDescription && <span>{colorDescription}</span>}
      </div>
    </SwatchLabel>
  );
}

function renderSwatchSpecimen(colors: Colors) {
  if (Array.isArray(colors)) {
    return (
      <SwatchSpecimen>
        <SwatchColors>{colors.map((color, index) => renderSwatch(color, index))}</SwatchColors>
        <SwatchLabels>{colors.map((color, index) => renderSwatchLabel(color, index))}</SwatchLabels>
      </SwatchSpecimen>
    );
  }
  return (
    <SwatchSpecimen>
      <SwatchColors>
        {Object.values(colors).map((color, index) => renderSwatch(color, index))}
      </SwatchColors>
      <SwatchLabels>
        {Object.keys(colors).map((color, index) => renderSwatchLabel(color, index, colors[color]))}
      </SwatchLabels>
    </SwatchSpecimen>
  );
}

/**
 * A single color row your styleguide showing title, subtitle and one or more colors, used
 * as a child of `ColorPalette`.
 */
export const ColorItem: FunctionComponent<ColorItemProps> = ({ title, subtitle, colors }) => {
  return (
    <Box css={{ display: 'grid', gridTemplateColumns: '30% auto', marginTop: 'medium' }}>
      <Stack gap="small">
        <Text tone="loud">{title}</Text>
        <Text tone="muted">{subtitle}</Text>
      </Stack>
      <Swatches>{renderSwatchSpecimen(colors)}</Swatches>
    </Box>
  );
};

/**
 * Styleguide documentation for colors, including names, captions, and color swatches,
 * all specified as `ColorItem` children of this wrapper component.
 */
export const ColorPalette: FunctionComponent = ({ children, ...props }) => (
  <ResetWrapper>
    <List {...props} className="docblock-colorpalette">
      <ListHeading>
        <ListName>Name</ListName>
        <ListSwatches>Swatches</ListSwatches>
      </ListHeading>
      <Stack gap="large">{children}</Stack>
    </List>
  </ResetWrapper>
);

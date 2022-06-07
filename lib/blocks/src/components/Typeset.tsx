import React, { CSSProperties, FunctionComponent } from 'react';
import { styled } from '@storybook/theming';
import { withReset } from '@storybook/components';
import { getBlockBackgroundStyle } from './BlockBackgroundStyles';
import { Box, Stack, Text } from '../primitives';

const Sample: React.FC<{ style: CSSProperties }> = ({ children, style }) => {
  return (
    <Box
      as="dd"
      css={{
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        maxWidth: '100%',
      }}
      style={style}
    >
      {children}
    </Box>
  );
};

const Wrapper = styled.div<{}>(withReset, ({ theme }) => ({
  ...getBlockBackgroundStyle(theme),
  margin: '25px 0 40px',
  padding: '30px 20px',
}));

export interface TypesetProps {
  fontFamily?: string;
  fontSizes: string[];
  fontWeight?: number;
  sampleText?: string;
}

/**
 * Convenient styleguide documentation showing examples of type
 * with different sizes and weights and configurable sample text.
 */
export const Typeset: FunctionComponent<TypesetProps> = ({
  fontFamily,
  fontSizes,
  fontWeight,
  sampleText = 'Was he a beast if music could move him so?',
  ...props
}) => (
  <Stack as="dl" gap="large" className="docblock-typeset" {...props}>
    {fontSizes.map((value) => (
      <Stack
        key={value}
        gap="large"
        orientation={['vertical', 'horizontal']}
        css={{
          alignItems: ['flex-start', 'baseline'],
          background: 'background',
        }}
      >
        <Text as="dt" variant="caption">
          {value}
        </Text>
        <Sample style={{ fontSize: value, fontWeight, fontFamily }}>{sampleText}</Sample>
      </Stack>
    ))}
  </Stack>
);

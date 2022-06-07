import React, { FunctionComponent } from 'react';
import { transparentize } from 'polished';
import { styled } from '@storybook/theming';
import { withReset } from '@storybook/components';
import { getBlockBackgroundStyle } from './BlockBackgroundStyles';
import { Box, Stack, Text } from '../primitives';

const Label = styled.div<{}>(({ theme }) => ({
  marginRight: 30,
  fontSize: `${theme.typography.size.s1}px`,
  color:
    theme.base === 'light'
      ? transparentize(0.4, theme.color.defaultText)
      : transparentize(0.6, theme.color.defaultText),
}));

const Sample = styled.div({
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
});

const TypeSpecimen = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'baseline',
  // '&:not(:last-child)': { marginBottom: '1rem' },
});

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
  sampleText,
  ...props
}) => (
  <Box className="docblock-typeset" {...props}>
    <Stack gap="large">
      {fontSizes.map((size) => (
        <Stack
          key={size}
          gap="small"
          orientation={['vertical', 'horizontal']}
          css={{
            alignItems: ['flex-start', 'flex-end'],
            background: 'background',
          }}
        >
          <Text variant="caption">{size}</Text>
          <Sample
            style={{
              fontFamily,
              fontSize: size,
              fontWeight,
              lineHeight: 1.2,
            }}
          >
            {sampleText || 'Was he a beast if music could move him so?'}
          </Sample>
        </Stack>
      ))}
    </Stack>
  </Box>
);

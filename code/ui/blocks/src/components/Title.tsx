import { styled } from '@storybook/core/dist/theming';
import { withReset } from '@storybook/components';

const breakpoint = 600;

export const Title = styled.h1(withReset, ({ theme }) => ({
  color: theme.color.defaultText,
  fontSize: theme.typography.size.m3,
  fontWeight: theme.typography.weight.bold,
  lineHeight: '32px',

  [`@media (min-width: ${breakpoint}px)`]: {
    fontSize: theme.typography.size.l1,
    lineHeight: '36px',
    marginBottom: '16px',
  },
}));

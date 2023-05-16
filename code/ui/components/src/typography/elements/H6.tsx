import { styled } from '@storybook/theming';
import { withReset, headerCommon } from '../lib/common';

export const H6 = styled.h6(withReset, headerCommon, ({ theme }: any) => ({
  fontSize: `${theme.typography.size.s2}px`,
  color: theme.color.dark,
}));

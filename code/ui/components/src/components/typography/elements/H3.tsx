import { styled } from '@storybook/core/dist/theming';
import { withReset, headerCommon } from '../lib/common';

export const H3 = styled.h3(withReset, headerCommon, ({ theme }) => ({
  fontSize: `${theme.typography.size.m1}px`,
}));

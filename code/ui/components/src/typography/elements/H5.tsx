import { styled } from '@storybook/theming';
import { withReset, headerCommon } from '../lib/common';

export const H5 = styled.h5(withReset, headerCommon, ({ theme }: any) => ({
  fontSize: `${theme.typography.size.s2}px`,
}));

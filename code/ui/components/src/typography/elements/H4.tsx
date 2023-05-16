import { styled } from '@storybook/theming';
import { withReset, headerCommon } from '../lib/common';

export const H4 = styled.h4(withReset, headerCommon, ({ theme }: any) => ({
  fontSize: `${theme.typography.size.s3}px`,
}));

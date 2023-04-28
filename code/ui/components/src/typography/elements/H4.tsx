import { styled } from '@junk-temporary-prototypes/theming';
import { withReset, headerCommon } from '../lib/common';

export const H4 = styled.h4(withReset, headerCommon, ({ theme }) => ({
  fontSize: `${theme.typography.size.s3}px`,
}));

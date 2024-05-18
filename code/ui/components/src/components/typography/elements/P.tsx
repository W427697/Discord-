import type { CSSObject } from '@storybook/core/dist/theming';
import { styled } from '@storybook/core/dist/theming';
import { withReset, withMargin, codeCommon } from '../lib/common';

export const P = styled.p(withReset, withMargin, ({ theme }) => ({
  fontSize: theme.typography.size.s2,
  lineHeight: '24px',
  color: theme.color.defaultText,
  '& code': codeCommon({ theme }) as CSSObject,
}));

import { styled } from '@storybook/theming';
import { withReset, codeCommon } from '../lib/common';

export const LI = styled.li(withReset, ({ theme }: any) => ({
  fontSize: theme.typography.size.s2,
  color: theme.color.defaultText,
  lineHeight: '24px',
  '& + li': {
    marginTop: '.25em',
  },
  '& ul, & ol': {
    marginTop: '.25em',
    marginBottom: 0,
  },
  '& code': codeCommon({ theme }),
}));

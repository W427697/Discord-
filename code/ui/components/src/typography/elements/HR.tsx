import { styled } from '@junk-temporary-prototypes/theming';

export const HR = styled.hr(({ theme }) => ({
  border: '0 none',
  borderTop: `1px solid ${theme.appBorderColor}`,
  height: 4,
  padding: 0,
}));

import { styled } from '@storybook/theming';

export const HR = styled.hr(({ theme }: any) => ({
  border: '0 none',
  borderTop: `1px solid ${theme.appBorderColor}`,
  height: 4,
  padding: 0,
}));

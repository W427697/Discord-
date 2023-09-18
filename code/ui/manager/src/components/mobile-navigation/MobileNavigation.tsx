import type { FC } from 'react';
import React from 'react';
import { styled } from '@storybook/theming';

const Container = styled.div(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  bottom: 0,
  left: 0,
  width: '100%',
  height: 40,
  zIndex: 10,
  background: theme.background.content,
  padding: '0 6px',
  borderTop: `1px solid ${theme.appBorderColor}`,
  backgroundColor: 'red',
}));

export const MobileNavigation: FC = () => {
  return <Container />;
};

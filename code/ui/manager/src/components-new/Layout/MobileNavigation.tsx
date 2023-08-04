import type { FC } from 'react';
import React from 'react';
import { styled } from '@storybook/theming';

const Container = styled.div(({ theme }) => ({
  position: 'fixed',
  boxSizing: 'border-box',
  bottom: 0,
  left: 0,
  width: '100%',
  height: 48,
  zIndex: 10,
  background: theme.background.content,
}));

export const MobileNavigation: FC = () => {
  return <Container>Hello World</Container>;
};

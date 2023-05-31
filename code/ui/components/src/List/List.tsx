import React from 'react';
import { styled } from '@storybook/theming';

const ListWrapper = styled.ul(() => ({
  display: 'flex',
  flexDirection: 'column',
  rowGap: 8,
  padding: 0,
  margin: 0,
}));

interface ListProps {
  children: React.ReactNode;
}

export function List({ children }: ListProps) {
  return <ListWrapper>{children}</ListWrapper>;
}

List.displayName = 'List';

/* eslint-disable import/no-unresolved */
import React from 'react';
import { Meta } from '@storybook/react';
import List from './List.js';
import ListItem from './ListItem.js';

export default {
  title: 'Docgen/List',
  component: List,
  subcomponents: {
    ListItem,
  },
} as Meta;

export const SimpleList = () => {
  return (
    <List>
      <ListItem>Hello World</ListItem>
    </List>
  );
};

export const WithMultiple = () => (
  <List>
    <ListItem>One</ListItem>
    <ListItem>Two</ListItem>
    <ListItem>Three</ListItem>
  </List>
);

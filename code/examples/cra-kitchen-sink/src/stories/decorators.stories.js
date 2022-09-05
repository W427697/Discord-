import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '../components/react-demo';

const Bold = ({ children }) => {
  return <b>{children}</b>;
};

Bold.propTypes = {
  children: PropTypes.string.isRequired,
};

export default {
  title: 'Decorators',
  component: Button,
  decorators: [
    (Story) => (
      <div style={{ padding: 25, border: '3px solid red' }}>
        <Story />
      </div>
    ),
  ],
};

export const WithArgs = (args) => <Button {...args} />;
WithArgs.args = { children: 'With args' };

export const Basic = () => <Button>Basic</Button>;

export const Nested = () => (
  <Button>
    <Bold>Hello</Bold>
  </Button>
);

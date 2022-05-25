import React from 'react';
import { Box } from '..';

export const Button = (props) => {
  return <Box as="button" type="button" padding="small" background="blue-50" {...props} />;
};

export default Button;

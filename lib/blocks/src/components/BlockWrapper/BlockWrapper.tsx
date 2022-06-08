import React from 'react';
import { Box } from '../../primitives';

/**
 * Use Block component to visually separate and elevate it from other content
 */
export const BlockWrapper: React.FC<{}> = ({ children }) => {
  return (
    <Box
      css={{
        padding: 'none',
        border: 'thin',
        borderColor: 'muted',
        borderRadius: 'small',
        boxShadow: 'block',
        background: 'background',
      }}
    >
      {children}
    </Box>
  );
};

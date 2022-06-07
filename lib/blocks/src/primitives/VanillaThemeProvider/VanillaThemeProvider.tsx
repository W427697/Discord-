import React from 'react';
import { Box } from '..';
import { darkTheme, lightTheme } from '../theme.css';

export const VanillaThemeProvider: React.FC<{ theme: 'light' | 'dark' }> = ({
  children,
  theme,
}) => {
  const className = theme === 'dark' ? darkTheme : lightTheme;
  return (
    <Box
      className={className}
      css={{
        padding: 'medium',
        background: 'background',
        color: 'text',
      }}
    >
      {children}
    </Box>
  );
};

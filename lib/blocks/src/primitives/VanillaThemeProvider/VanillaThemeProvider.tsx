import React from 'react';
import { darkTheme, lightTheme } from '../theme.css';

export const VanillaThemeProvider = ({ children, theme }) => {
  return <div className={theme === 'dark' ? darkTheme : lightTheme}>{children}</div>;
};

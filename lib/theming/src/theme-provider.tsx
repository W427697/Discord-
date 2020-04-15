import React from 'react';
import { Context } from './context';
import { Theme } from './types';

interface ThemeProviderProps {
  theme: Theme;
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ theme, children }) => (
  <Context.Provider value={theme}>{children}</Context.Provider>
);

import React from 'react';
import { Context } from './context';
import { Theme } from './types';

export const withTheme = <P extends { theme: Theme }>(
  Component: React.ComponentType<Partial<P>>
) => {
  const ComponentWithTheme = React.forwardRef<unknown, Omit<P, 'theme'>>((props, ref) => (
    <Context.Consumer>
      {(theme) => <Component {...props} ref={ref} theme={theme} />}
    </Context.Consumer>
  ));

  ComponentWithTheme.displayName = Component.displayName || Component.name;

  return ComponentWithTheme;
};

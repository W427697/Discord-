import React from 'react';
import { Context } from './context';

export const withTheme = (Component: any) => {
  return React.forwardRef((props, ref) => (
    <Context.Consumer>
      {(theme) => <Component {...props} ref={ref} theme={theme} />}
    </Context.Consumer>
  ));
};

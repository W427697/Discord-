import React, { ComponentPropsWithoutRef, ElementType } from 'react';
import { getBoxProps, extractSprinklesFromProps, Sprinkles } from './rainbow-sprinkles';
import * as styles from './Box.css';

export type BoxProps<C extends ElementType> = Sprinkles &
  ComponentPropsWithoutRef<C> & {
    as?: C;
  };

export const Box = <C extends ElementType = 'div'>({ as, children, ...props }: BoxProps<C>) => {
  const { sprinkles, otherProps } = extractSprinklesFromProps(props);

  const Component = as || 'div';

  return (
    <Component {...getBoxProps(styles.rainbowSprinklesCss, sprinkles)} {...otherProps}>
      {children}
    </Component>
  );
};

export default Box;

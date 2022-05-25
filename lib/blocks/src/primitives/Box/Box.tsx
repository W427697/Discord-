import type * as Polymorphic from '@radix-ui/react-polymorphic';
import clsx from 'clsx';
import type { FillingsProps } from 'lib/blocks/src/fillings';
import React from 'react';
import { sizeFillings, sprinkles, Sprinkles } from '../sprinkles.css';

export type BoxOwnProps = Sprinkles & FillingsProps<typeof sizeFillings>;

type PolymorphicBox = Polymorphic.ForwardRefComponent<'div', BoxOwnProps>;

export const Box = React.forwardRef(({ as: Element = 'div', ...props }, forwardedRef) => {
  const atomProps: Record<string, unknown> = {};
  const nativeProps: Record<string, unknown> = {};

  // eslint-disable-next-line no-restricted-syntax
  for (const key in props) {
    if (sprinkles.properties.has(key as keyof Sprinkles)) {
      atomProps[key] = props[key as keyof typeof props];
    } else {
      nativeProps[key] = props[key as keyof typeof props];
    }
  }

  const sprinkleClass = sprinkles(atomProps);

  const { className: fillingClassName, assignVars } = sizeFillings(nativeProps);
  return (
    <Element
      style={assignVars()}
      className={clsx(sprinkleClass, fillingClassName, props.className)}
      ref={forwardedRef}
      {...nativeProps}
    />
  );
}) as PolymorphicBox;

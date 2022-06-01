import type { FillingsProps } from '@angelblock/fillings';
import clsx from 'clsx';
import React, { AllHTMLAttributes, createElement, CSSProperties, forwardRef } from 'react';
import { sizeFillings, sprinkles, Sprinkles as AtomicStyles } from '../sprinkles.css';

type DynamicStyles = FillingsProps<typeof sizeFillings>;
type DynamicProperties = keyof DynamicStyles;
type AtomicProperties = keyof AtomicStyles;

type KnownCSSProperties = AtomicProperties | DynamicProperties;

export interface BoxStyleProps
  extends AtomicStyles,
    DynamicStyles,
    Omit<CSSProperties, KnownCSSProperties> {}

export interface BoxBaseProps {
  css?: BoxStyleProps;
}

export interface BoxProps extends BoxBaseProps, AllHTMLAttributes<HTMLElement> {
  // TODO: Figure out how to use JSX.IntrinsicElements here
  as?: string;
}

export const Box = forwardRef<HTMLElement, BoxProps>(
  ({ as = 'div', css, className: userClassName, children, ...props }, forwardedRef) => {
    const atomicStyles: Record<string, unknown> = {};
    const dynamicStyles: Record<string, unknown> = {};
    const customStyles: Record<string, unknown> = {};

    // eslint-disable-next-line no-restricted-syntax
    for (const key in css) {
      if (sprinkles.properties.has(key as AtomicProperties)) {
        atomicStyles[key] = css[key as keyof typeof css];
      } else if (sizeFillings.properties.includes(key as DynamicProperties)) {
        dynamicStyles[key] = css[key as keyof typeof css];
      } else {
        customStyles[key] = css[key as keyof typeof css];
      }
    }

    const sprinkleClass = sprinkles(atomicStyles);

    const { className: fillingClassName, style } = sizeFillings(dynamicStyles);

    return createElement(
      as,
      {
        style: { ...style, ...customStyles },
        className: clsx(sprinkleClass, fillingClassName, userClassName),
        ref: forwardedRef,
        ...props,
      },
      children
    );
  }
);

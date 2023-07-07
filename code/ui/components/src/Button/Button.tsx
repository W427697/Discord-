import type { FC, ReactNode } from 'react';
import React, { forwardRef } from 'react';
import { ButtonWrapper, ButtonWrapper2 } from './styles';

export interface ButtonProps {
  children?: ReactNode;
  href?: string;
  size?: 'sm' | 'md';
  variant?: 'solid' | 'outline';
  color?: 'blue' | 'gray';
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  /**
   * @deprecated This property will be removed in SB 8.0
   * Use `as='a'` property instead.
   */
  isLink?: boolean;
  /**
   * @deprecated This property will be removed in SB 8.0
   * This colour is not used anymore.
   */
  primary?: boolean;
  /**
   * @deprecated This property will be removed in SB 8.0
   * Use `variant='solid' color='blue'` property instead.
   */
  secondary?: boolean;
  /**
   * @deprecated This property will be removed in SB 8.0
   * Use `variant='solid' color='gray'` property instead.
   */
  tertiary?: boolean;
  /**
   * @deprecated This property will be removed in SB 8.0
   * Use `variant='solid' color='gray'` property instead.
   */
  gray?: boolean;
  /**
   * @deprecated This property will be removed in SB 8.0
   */
  inForm?: boolean;
  /**
   * @deprecated This property will be removed in SB 8.0
   * Use `size='sm'` property instead.
   */
  small?: boolean;
  /**
   * @deprecated This property will be removed in SB 8.0
   * Use `variant='outline'` property instead.
   */
  outline?: boolean;
  /**
   * @deprecated This property will be removed in SB 8.0
   * Use `leftIcon={<YourIcon />}` property instead.
   */
  containsIcon?: boolean;
}

const ButtonLink = ButtonWrapper.withComponent('a');

export const Button: FC<ButtonProps> = forwardRef<any, ButtonProps>(
  (
    {
      isLink = false,
      gray,
      primary,
      secondary,
      tertiary,
      inForm,
      small,
      outline,
      containsIcon,
      size = 'md',
      color = 'blue',
      variant = 'solid',
      children,
      ...props
    },
    ref
  ) => {
    const isDepreciated =
      primary || secondary || tertiary || gray || inForm || small || outline || containsIcon;

    if (!!isDepreciated && isLink) {
      return (
        <ButtonLink
          ref={ref}
          isLink={isLink}
          gray={gray}
          primary={primary}
          secondary={secondary}
          tertiary={tertiary}
          inForm={inForm}
          small={small}
          outline={outline}
          containsIcon={containsIcon}
          {...props}
        >
          {children}
        </ButtonLink>
      );
    }

    if (isDepreciated) {
      return (
        <ButtonWrapper
          ref={ref}
          isLink={isLink}
          gray={gray}
          primary={primary}
          secondary={secondary}
          tertiary={tertiary}
          inForm={inForm}
          small={small}
          outline={outline}
          containsIcon={containsIcon}
          {...props}
        >
          {children}
        </ButtonWrapper>
      );
    }

    return (
      <ButtonWrapper2 size={size} color={color} variant={variant}>
        {children}
      </ButtonWrapper2>
    );
  }
);

Button.displayName = 'Button';

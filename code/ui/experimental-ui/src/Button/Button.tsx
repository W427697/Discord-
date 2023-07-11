import type { ReactNode } from 'react';
import React, { forwardRef } from 'react';
import { ButtonWrapper } from './styles';

export interface ButtonProps {
  children: string;
  href?: string;
  size?: 'small' | 'medium';
  type?: 'primary' | 'secondary' | 'tertiary';
  icon?: ReactNode;
  iconOnly?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  active?: boolean;
  as?: any;
}

const ButtonLink = ButtonWrapper.withComponent('a');

export const Button = forwardRef<any, ButtonProps>(
  (
    {
      size = 'medium',
      type = 'primary',
      icon,
      iconOnly = false,
      disabled = false,
      active = false,
      href,
      children,
    },
    ref
  ) => {
    if (href)
      return (
        <ButtonLink ref={ref} size={size} btnType={type} disabled={disabled} active={active}>
          {icon}
          {!iconOnly && children}
        </ButtonLink>
      );

    return (
      <ButtonWrapper ref={ref} size={size} btnType={type} disabled={disabled} active={active}>
        {icon}
        {!iconOnly && children}
      </ButtonWrapper>
    );
  }
);

Button.displayName = 'Button';

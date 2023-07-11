import type { ReactNode } from 'react';
import React, { forwardRef } from 'react';
import { ButtonWrapper } from './styles';

export type ButtonProps = (
  | React.ButtonHTMLAttributes<HTMLButtonElement>
  | React.AnchorHTMLAttributes<HTMLAnchorElement>
) & {
  children: string;
  size?: 'small' | 'medium';
  variant?: 'primary' | 'secondary' | 'tertiary';
  icon?: ReactNode;
  iconOnly?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  active?: boolean;
};

const ButtonLink = ButtonWrapper.withComponent('a');

export const Button = forwardRef<any, ButtonProps>((props, ref) => {
  const {
    size = 'medium',
    variant = 'primary',
    icon,
    iconOnly = false,
    disabled = false,
    active = false,
    children,
  } = props;
  if ('href' in props)
    return (
      <ButtonLink
        ref={ref}
        size={size}
        variant={variant}
        disabled={disabled}
        active={active}
        iconOnly={iconOnly}
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {icon}
        {!iconOnly && children}
      </ButtonLink>
    );

  return (
    <ButtonWrapper
      ref={ref}
      size={size}
      variant={variant}
      disabled={disabled}
      active={active}
      iconOnly={iconOnly}
      {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {icon}
      {!iconOnly && children}
    </ButtonWrapper>
  );
});

Button.displayName = 'Button';

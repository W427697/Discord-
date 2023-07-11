import type { ReactNode } from 'react';
import React, { forwardRef } from 'react';
import { ButtonWrapper, ButtonWrapperDepreciated } from './styles';

export interface ButtonProps {
  children?: ReactNode;
  href?: string;
  size?: 'small' | 'medium';
  type?: 'primary' | 'secondary' | 'tertiary';
  icon?: ReactNode;
  iconOnly?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  active?: boolean;
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

const ButtonLink = ButtonWrapperDepreciated.withComponent('a');
const NewButtonLink = ButtonWrapper.withComponent('a');

export const Button = forwardRef<any, ButtonProps>(
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
      size = 'medium',
      type = 'primary',
      icon,
      iconOnly = false,
      disabled = false,
      active = false,
      href,
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
        <ButtonWrapperDepreciated
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
        </ButtonWrapperDepreciated>
      );
    }

    if (href)
      return (
        <NewButtonLink ref={ref} size={size} btnType={type} disabled={disabled} active={active}>
          {icon}
          {!iconOnly && children}
        </NewButtonLink>
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

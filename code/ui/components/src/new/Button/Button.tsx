import type { ReactNode } from 'react';
import React, { forwardRef } from 'react';
import { ButtonWrapper } from './styles';

export type ButtonPropsOld = (
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

export const ButtonOld = forwardRef<any, ButtonPropsOld>((props, ref) => {
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

ButtonOld.displayName = 'ButtonOld';

type PropsOf<T extends keyof JSX.IntrinsicElements | React.JSXElementConstructor<any>> =
  JSX.LibraryManagedAttributes<T, React.ComponentPropsWithRef<T>>;

export interface ButtonProps<T extends React.ElementType = React.ElementType> {
  as?: T;
  children: string;
  size?: 'small' | 'medium';
  variant?: 'primary' | 'secondary' | 'tertiary';
  icon?: ReactNode;
  iconOnly?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  active?: boolean;
}

export const Button: {
  <E extends React.ElementType = 'button'>(
    props: ButtonProps<E> & Omit<PropsOf<E>, keyof ButtonProps>
  ): JSX.Element;
  displayName?: string;
} = forwardRef(
  ({ as, children, icon, iconOnly, ...props }: ButtonProps, ref: React.Ref<Element>) => {
    const Component = as ?? ButtonWrapper;

    return (
      <Component ref={ref} {...props}>
        {icon}
        {!iconOnly && children}
      </Component>
    );
  }
);

Button.displayName = 'Button';

// const Link = (props: { to: string }) => <a {...props} />;

// const A = (
//   <Button as={'a'} href='/bl'>
//     asdf
//   </Button>
// );

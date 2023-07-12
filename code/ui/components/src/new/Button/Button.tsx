import type { ReactNode } from 'react';
import React, { forwardRef } from 'react';
import { css } from '@storybook/theming';
import { ButtonWrapper } from './styles';

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

const superStyles = css`
  background-color: aliceblue;
`;

export const Button: {
  <E extends React.ElementType = 'button'>(
    props: ButtonProps<E> & Omit<PropsOf<E>, keyof ButtonProps>
  ): JSX.Element;
  displayName?: string;
} = forwardRef(({ as, children, icon, ...props }: ButtonProps, ref: React.Ref<Element>) => {
  const Component = as ?? 'button';
  return (
    <Component className={superStyles} as={as} ref={ref} {...props}>
      {icon}
      {!props.iconOnly && children}
    </Component>
  );
});

Button.displayName = 'Button';

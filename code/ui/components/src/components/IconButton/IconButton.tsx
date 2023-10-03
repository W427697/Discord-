import type { ReactNode, SyntheticEvent } from 'react';
import React, { forwardRef, useEffect, useState } from 'react';
import { styled } from '@storybook/theming';
import { darken, lighten, rgba, transparentize } from 'polished';
import { Slot } from '@radix-ui/react-slot';

interface IconButtonProps {
  children: ReactNode;
  asChild?: boolean;
  size?: 'small' | 'medium';
  variant?: 'solid' | 'outline' | 'ghost';
  onClick?: (event: SyntheticEvent) => void;
  disabled?: boolean;
  active?: boolean;
  onClickAnimation?: 'none' | 'rotate360' | 'glow' | 'jiggle';
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ asChild, onClickAnimation = 'none', onClick, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    const [isAnimating, setIsAnimating] = useState(false);

    const handleClick = (event: SyntheticEvent) => {
      if (onClick) onClick(event);
      if (onClickAnimation === 'none') return;
      setIsAnimating(true);
    };

    useEffect(() => {
      const timer = setTimeout(() => {
        if (isAnimating) setIsAnimating(false);
      }, 1000);
      return () => clearTimeout(timer);
    }, [isAnimating]);

    return (
      <StyledButton
        as={Comp}
        ref={ref}
        {...props}
        onClick={handleClick}
        isAnimating={isAnimating}
        animation={onClickAnimation}
      />
    );
  }
);

IconButton.displayName = 'IconButton';

const StyledButton = styled.button<
  IconButtonProps & {
    isAnimating: boolean;
    animation: IconButtonProps['onClickAnimation'];
  }
>(
  ({
    theme,
    variant = 'ghost',
    size = 'small',
    disabled = false,
    active = false,
    isAnimating,
    animation,
  }) => ({
    border: 0,
    cursor: disabled ? 'not-allowed' : 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    minWidth: `${(() => {
      if (size === 'small') return '28px';
      if (size === 'medium') return '32px';
      return 'auto';
    })()}`,
    padding: size === 'small' ? '0 7px' : '0 9px',
    height: size === 'small' ? '28px' : '32px',
    position: 'relative',
    textAlign: 'center',
    textDecoration: 'none',
    transitionProperty: 'background, box-shadow',
    transitionDuration: '150ms',
    transitionTimingFunction: 'ease-out',
    verticalAlign: 'top',
    whiteSpace: 'nowrap',
    userSelect: 'none',
    opacity: disabled ? 0.5 : 1,
    margin: 0,
    fontSize: `${theme.typography.size.s1}px`,
    fontWeight: theme.typography.weight.bold,
    lineHeight: '1',
    background: `${(() => {
      if (variant === 'solid') return theme.color.secondary;
      if (variant === 'outline') return theme.button.background;
      if (variant === 'ghost' && active) return theme.background.hoverable;
      return 'transparent';
    })()}`,
    color: `${(() => {
      if (variant === 'solid') return theme.color.lightest;
      if (variant === 'outline') return theme.input.color;
      if (variant === 'ghost' && active) return theme.color.secondary;
      if (variant === 'ghost') return theme.color.mediumdark;
      return theme.input.color;
    })()}`,
    boxShadow: variant === 'outline' ? `${theme.button.border} 0 0 0 1px inset` : 'none',
    borderRadius: theme.input.borderRadius,

    '&:hover': {
      color: variant === 'ghost' ? theme.color.secondary : null,
      background: `${(() => {
        let bgColor = theme.color.secondary;
        if (variant === 'solid') bgColor = theme.color.secondary;
        if (variant === 'outline') bgColor = theme.button.background;

        if (variant === 'ghost') return transparentize(0.86, theme.color.secondary);
        return theme.base === 'light' ? darken(0.02, bgColor) : lighten(0.03, bgColor);
      })()}`,
    },

    '&:active': {
      color: variant === 'ghost' ? theme.color.secondary : null,
      background: `${(() => {
        let bgColor = theme.color.secondary;
        if (variant === 'solid') bgColor = theme.color.secondary;
        if (variant === 'outline') bgColor = theme.button.background;

        if (variant === 'ghost') return theme.background.hoverable;
        return theme.base === 'light' ? darken(0.02, bgColor) : lighten(0.03, bgColor);
      })()}`,
    },

    '&:focus': {
      boxShadow: `${rgba(theme.color.secondary, 1)} 0 0 0 1px inset`,
      outline: 'none',
    },

    '> *': {
      display: 'flex',
      alignItems: 'center',
      gap: 2,
      minWidth: 14,
      height: 14,
      animation:
        isAnimating && animation !== 'none' && `${theme.animation[animation]} 1000ms ease-out`,
    },
  })
);

import { styled } from '@storybook/theming';
import React, { forwardRef, HTMLAttributes, memo, ReactNode, RefObject, useRef } from 'react';
import { TabButtonProps as BarButtonProps } from '../bar/button';
import { useContentRect } from '../hooks/useContentRect';
import { Icons, IconsProps } from '../icon/icon';
import { icons } from '../icon/icons';

export type TabButtonRect = {
  width: number;
  height: number;
  x: number;
  y: number;
};

export type TabButtonProps = {
  LabelProps?: HTMLAttributes<HTMLSpanElement>;
  buttonRef?: RefObject<HTMLButtonElement>;
  icon?: IconsProps['icon'] | ReactNode;
  id?: string;
  label?: string;
  narrow?: boolean;
  type?: 'content' | 'button' | 'menu';
  onRectChange?: (rect: TabButtonRect) => void;
} & BarButtonProps &
  HTMLAttributes<HTMLButtonElement>;

export const TabButton = memo(
  forwardRef(
    (
      {
        LabelProps = {},
        active,
        buttonRef,
        children,
        icon,
        id,
        label: _label,
        narrow,
        type,
        onRectChange,
        ...rest
      }: TabButtonProps,
      ref: RefObject<HTMLButtonElement>
    ) => {
      const innerRef = useRef<HTMLDivElement>();
      const { height, x, y, width } = useContentRect(innerRef);
      let Icon: ReactNode = icon;

      /** @todo Use icon & Icon instead of dual purpose on one prop */
      if (typeof icon === 'string') {
        if (icons[icon as IconsProps['icon']]) {
          Icon = <Icons icon={icon as IconsProps['icon']} />;
        } else {
          Icon = icon;
        }
      }

      const labelId = `${id}-label`;
      const label = _label || (typeof Icon === 'string' ? Icon : id);
      const hasLabel = _label !== undefined;

      if (onRectChange) {
        onRectChange({ height, x, y, width });
      }

      return (
        <Wrapper
          aria-labelledby={labelId}
          role="tab"
          id={id}
          key={`${id}-tabbutton`}
          narrow={narrow}
          active={active}
          className={`tabbutton ${active ? 'tabbutton-active' : ''}`}
          ref={buttonRef || ref}
          {...rest}
        >
          <WrapperInner ref={innerRef} narrow={narrow}>
            {Icon && <IconWrapper hasLabel={hasLabel}>{Icon}</IconWrapper>}
            <Label id={labelId} hasLabel={hasLabel} {...LabelProps}>
              {label}
            </Label>
          </WrapperInner>
        </Wrapper>
      );
    }
  )
);

export interface WrapperProps {
  active?: boolean;
  textColor?: string;
  narrow?: boolean;
}

export const Wrapper = styled.button<WrapperProps>(
  {
    whiteSpace: 'normal',
    display: 'inline-flex',
    overflow: 'hidden',
    verticalAlign: 'top',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    textDecoration: 'none',

    '&:empty': {
      display: 'none',
    },
  },
  ({ theme, narrow }) => ({
    padding: 0,
    margin: narrow ? '0 8px' : '0',
    transition: 'color 0.2s linear, border-bottom-color 0.2s linear',
    height: 40,
    lineHeight: '12px',
    cursor: 'pointer',
    background: 'transparent',
    border: '0 solid transparent',
    borderTop: '3px solid transparent',
    borderBottom: '3px solid transparent',
    fontWeight: 'bold',
    fontSize: 13,

    '&:focus': {
      outline: '0 none',
      borderBottomColor: theme.color.secondary,
    },
  }),
  ({ active, textColor, theme }) =>
    active
      ? {
          color: textColor || theme.barSelectedColor,
          borderBottomColor: theme.barSelectedColor,
        }
      : {
          color: textColor || theme.barTextColor,
          borderBottomColor: 'transparent',
        }
);

export interface WrapperInnerProps {
  narrow?: boolean;
}

const WrapperInner = styled.div<WrapperInnerProps>(({ narrow }) => ({
  padding: narrow ? '0' : '0 16px',
  display: 'flex',
  alignItems: 'center',
  height: 40,
}));

interface IconWrapperProps {
  hasLabel?: boolean;
}

const IconWrapper = styled.span<IconWrapperProps>(({ hasLabel }) => ({
  svg: {
    height: 15,
    marginRight: hasLabel ? 8 : 0,
  },
}));

interface LabelProps {
  hasLabel?: boolean;
}

const Label = styled.span<LabelProps>(({ hasLabel }) => ({
  visibility: hasLabel ? 'visible' : 'hidden',
  opacity: hasLabel ? 1 : 0,
  width: hasLabel ? 'auto' : 0,
}));

import React, { FC, HTMLAttributes } from 'react';
import { styled } from '@storybook/theming';

export type TabsButtonProps = {
  active?: boolean;
  color?: string;
} & HTMLAttributes<HTMLButtonElement>;

export const TabsButton: FC<TabsButtonProps> = ({ active, color, ...rest }) => {
  return <Wrapper active={active} textColor={color} {...rest} />;
};

interface WrapperProps {
  active: boolean;
  textColor: string;
}

const Wrapper = styled.button<WrapperProps>(
  {
    whiteSpace: 'normal',
    display: 'inline-flex',
    overflow: 'hidden',
    verticalAlign: 'top',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    textDecoration: 'none',
  },
  ({ theme }) => ({
    padding: '0 15px',
    transition: 'color 0.2s linear, border-bottom-color 0.2s linear',
    height: 40,
    lineHeight: 12,
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

    '& > svg': {
      height: 15,
      marginRight: 4,
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

import { styled } from '@storybook/theming';
import type { ReactNode } from 'react';

export const Pane = styled.div<{
  border?: 'left' | 'right' | 'top' | 'bottom';
  animate?: boolean;
  top?: boolean;
  hidden?: boolean;
  children: ReactNode;
}>(
  {
    position: 'absolute',
    boxSizing: 'border-box',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  ({ hidden }) =>
    hidden
      ? {
          opacity: 0,
        }
      : {
          opacity: 1,
        },
  ({ top }) =>
    top
      ? {
          zIndex: 9,
        }
      : {},
  ({ border, theme }) => {
    switch (border) {
      case 'left': {
        return {
          borderLeft: `1px solid ${theme.appBorderColor}`,
        };
      }
      case 'right': {
        return {
          borderRight: `1px solid ${theme.appBorderColor}`,
        };
      }
      case 'top': {
        return {
          borderTop: `1px solid ${theme.appBorderColor}`,
        };
      }
      case 'bottom': {
        return {
          borderBottom: `1px solid ${theme.appBorderColor}`,
        };
      }
      default: {
        return {};
      }
    }
  },
  ({ animate }) =>
    animate
      ? {
          transition: ['width', 'height', 'top', 'left', 'background', 'opacity', 'transform']
            .map((p) => `${p} 0.1s ease-out`)
            .join(','),
        }
      : {}
);

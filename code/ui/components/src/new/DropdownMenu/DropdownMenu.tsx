import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import React from 'react';
import { styled, lighten } from '@storybook/theming';
import { transparentize, rgba } from 'polished';

type DropdownMenuItemProps = React.ComponentProps<typeof DropdownMenuPrimitive.Item> & {
  active?: boolean;
  loading?: boolean;
  disabled?: boolean;
};

const StyledItem = styled(DropdownMenuPrimitive.Item)<DropdownMenuItemProps>(
  ({ theme }) => ({
    fontSize: theme.typography.size.s1,
    transition: 'all 150ms ease-out',
    textDecoration: 'none',
    cursor: 'pointer',
    justifyContent: 'space-between',

    lineHeight: '1.5',
    paddingBlock: '7px',
    paddingInline: '10px',
    display: 'flex',
    alignItems: 'center',

    color: theme.color.defaultText,
    // Previously was theme.typography.weight.normal but this weight does not exists in Theme
    fontWeight: theme.typography.weight.regular,

    '& > * + *': {
      paddingLeft: 10,
    },

    '&:focus': {
      boxShadow: `${rgba(theme.color.secondary, 1)} 0 0 0 1px inset`,
      outline: 'none',
    },

    '&:first-child': {
      borderStartStartRadius: theme.appBorderRadius,
      borderStartEndRadius: theme.appBorderRadius,
    },

    '&:last-child': {
      borderEndStartRadius: theme.appBorderRadius,
      borderEndEndRadius: theme.appBorderRadius,
    },
  }),
  ({ active, theme }) =>
    active
      ? {
          color: theme.color.secondary,
          fontWeight: theme.typography.weight.bold,
        }
      : {},
  ({ loading, theme }) =>
    loading
      ? {
          display: 'inline-block',
          flex: 'none',
          ...theme.animation.inlineGlow,
        }
      : {},
  ({ disabled, theme }) =>
    disabled
      ? {
          color: transparentize(0.7, theme.color.defaultText),
        }
      : {
          '&:hover': {
            backgroundColor: theme.background.hoverable,
          },

          '&:hover svg': {
            opacity: 1,
          },
        }
);

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  DropdownMenuItemProps
>(({ className, children, active = false, disabled = false, loading = false, ...props }, ref) => (
  <StyledItem ref={ref} active={active} disabled={disabled} loading={loading} {...props}>
    {children}
  </StyledItem>
));
DropdownMenuItem.displayName = 'DropdownMenuItem';

const StyledContent = styled(DropdownMenuPrimitive.Content)(({ theme }) => ({
  minWidth: 180,
  overflow: 'hidden',
  overflowY: 'auto',
  maxHeight: 15.5 * 32, // 11.5 items
  backgroundColor: theme.base === 'light' ? lighten(theme.background.app) : theme.background.app,
  filter: `
        drop-shadow(0px 5px 5px rgba(0,0,0,0.05))
        drop-shadow(0 1px 3px rgba(0,0,0,0.1))
      `,
  borderRadius: theme.appBorderRadius,
}));

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <StyledContent ref={ref} {...props}>
    {children}
  </StyledContent>
));
DropdownMenuContent.displayName = 'DropdownMenuContent';

const StyledTrigger = styled(DropdownMenuPrimitive.Trigger)(({ theme }) => ({
  '&[aria-expanded="true"]': {
    backgroundColor: transparentize(0.86, theme.color.secondary),
  },
}));

export const DropdownMenu = {
  ...DropdownMenuPrimitive,
  Root: DropdownMenuPrimitive.Root,
  Item: DropdownMenuItem,
  Content: DropdownMenuContent,
  Trigger: StyledTrigger,
};

import * as RadixSelect from '@radix-ui/react-select';
import type { ElementRef, FC, ReactNode } from 'react';
import React, { forwardRef } from 'react';
import { styled } from '@storybook/theming';

interface SelectProps {
  placeholder?: string;
}

const FakeIcon = styled.div(({ theme }) => ({
  width: 12,
  height: 12,
  backgroundColor: theme.color.mediumdark,
}));

interface SelectItemProps {
  children: ReactNode;
  value: string;
}

const Item = forwardRef<HTMLDivElement, SelectItemProps>(({ children, ...props }, forwardedRef) => {
  return (
    <StyledItem {...props} ref={forwardedRef}>
      <RadixSelect.ItemText>{children}</RadixSelect.ItemText>
      <StyledItemIndicator className="SelectItemIndicator">
        <FakeIcon />
      </StyledItemIndicator>
    </StyledItem>
  );
});

Item.displayName = 'SelectItem';

export const Select: FC<SelectProps> = Object.assign(
  forwardRef<ElementRef<typeof RadixSelect.Root>, SelectProps>(function Select(
    { placeholder, children, ...props },
    ref
  ) {
    return (
      <RadixSelect.Root {...props}>
        <StyledTrigger>
          <RadixSelect.Value placeholder={placeholder} />
          <RadixSelect.Icon>
            <FakeIcon />
          </RadixSelect.Icon>
        </StyledTrigger>
        <RadixSelect.Portal>
          <StyledContent>
            <StyledScrollUpButton>
              <FakeIcon />
            </StyledScrollUpButton>
            <StyledViewport>{children}</StyledViewport>
            <StyledScrollDownButton>
              <FakeIcon />
            </StyledScrollDownButton>
            <RadixSelect.Arrow />
          </StyledContent>
        </RadixSelect.Portal>
      </RadixSelect.Root>
    );
  }),
  { displayName: 'Select', Item }
);

Select.displayName = 'Select';

const StyledTrigger = styled(RadixSelect.Trigger)(({ theme }) => ({
  all: 'unset',
  display: 'flex',
  width: '100%',
  height: '32px',
  alignItems: 'center',
  justifyContent: 'space-between',
  transition: 'box-shadow 200ms ease-out, opacity 200ms ease-out',
  color: theme.input.color,
  background: theme.input.background,
  boxShadow: `${theme.input.border} 0 0 0 1px inset`,
  borderRadius: theme.input.borderRadius,
  fontSize: theme.typography.size.s2 - 1,
  padding: '6px 10px',
  boxSizing: 'border-box',
  lineHeight: '20px',

  '&:focus': {
    boxShadow: `${theme.color.secondary} 0 0 0 1px inset`,
    outline: 'none',
  },

  '&[disabled]': {
    cursor: 'not-allowed',
    opacity: 0.5,
  },

  '&[data-placeholder]': {
    color: theme.textMutedColor,
  },

  '&:-webkit-autofill': {
    WebkitBoxShadow: `0 0 0 3em ${theme.color.lightest} inset`,
  },
}));

const StyledContent = styled(RadixSelect.Content)(({ theme }) => ({
  overflow: 'hidden',
  backgroundColor: 'white',
  borderRadius: '6px',
  boxShadow:
    '0px 10px 38px -10px rgba(22, 23, 24, 0.35), 0px 10px 20px -15px rgba(22, 23, 24, 0.2)',
}));

const StyledViewport = styled(RadixSelect.Viewport)(({ theme }) => ({
  padding: '5px',
}));

const StyledScrollUpButton = styled(RadixSelect.ScrollUpButton)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '25px',
  backgroundColor: 'white',
  color: 'blue',
  cursor: 'default',
}));

const StyledScrollDownButton = styled(RadixSelect.ScrollDownButton)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '25px',
  backgroundColor: 'white',
  color: 'blue',
  cursor: 'default',
}));

const StyledItem = styled(RadixSelect.Item)(({ theme }) => ({
  fontSize: '13px',
  lineHeight: 1,
  color: 'blue',
  borderRadius: '3px',
  display: 'flex',
  alignItems: 'center',
  height: '25px',
  padding: '0 35px 0 25px',
  position: 'relative',
  userSelect: 'none',

  '&[data-disabled]': {
    color: 'red',
    pointerEvents: 'none',
  },

  '&[data-highlighted]': {
    outline: 'none',
    backgroundColor: 'green',
    color: 'white',
  },
}));

const StyledItemIndicator = styled(RadixSelect.ItemIndicator)(({ theme }) => ({
  position: 'absolute',
  left: 0,
  width: '25px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

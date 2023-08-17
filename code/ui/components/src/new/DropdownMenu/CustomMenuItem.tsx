import type { ReactNode } from 'react';
import React from 'react';
import { styled } from '@storybook/theming';
import { transparentize } from 'polished';
import { KeyboardShortcut } from '../KeyboardShortcut/KeyboardShortcut';

const IconContainer = styled.span(({ theme }) => ({
  height: '12px',
  width: '12px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: '0',
  color: theme.color.mediumdark,

  '&& *': {
    height: '12px',
    width: '12px',
  },
}));

const LabelContainer = styled.p(({ theme }) => ({
  margin: 0,
  fontSize: theme.typography.size.s1,
  fontWeight: theme.typography.weight.regular,
  lineHeight: '1.5',
  color: theme.textColor,
}));

const DescriptionContainer = styled.p(({ theme }) => ({
  margin: 0,
  fontSize: 11,
  fontWeight: theme.typography.weight.regular,
  lineHeight: '1.5',
  color: theme.textMutedColor,
}));

type StyledItemProps = {
  active?: boolean;
  disabled?: boolean;
  startInlineIndent?: boolean;
};

const StyledItem = styled.div<StyledItemProps>(
  ({ theme }) => ({
    paddingBlock: '7px',
    paddingInline: '10px',
    display: 'flex',
    alignItems: 'center',
    gap: 10,

    '&:hover:not([disabled])': {
      backgroundColor: theme.background.hoverable,
    },

    '&:hover:not([disabled]) svg': {
      opacity: 1,
    },
  }),
  ({ active = false, theme }) =>
    active
      ? {
          '&& p, && svg': {
            color: theme.color.secondary,
          },
          '&& p:first-of-type': {
            fontWeight: theme.typography.weight.bold,
          },
        }
      : {},
  ({ disabled = false, theme }) =>
    disabled
      ? {
          '&& p, && svg': {
            color: transparentize(0.7, theme.color.defaultText),
          },
        }
      : {},
  ({ startInlineIndent }) =>
    startInlineIndent
      ? {
          paddingInlineStart: '32px',
        }
      : {}
);

type CustomMenuItemProps = StyledItemProps & {
  label: string;
  description?: string;
  icon?: ReactNode;
  keyboardShortcut?: React.ComponentProps<typeof KeyboardShortcut> & {
    /**
     * Will be used as the value of aria-keyshortcuts
     * which exposes the shortcut to people using assistive technologies
     * More information here: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-keyshortcuts
     */
    ariaKeyshortcuts: string;
  };
};

export function CustomMenuItem({
  label,
  description,
  icon,
  keyboardShortcut,
  active,
  startInlineIndent,
  disabled,
}: CustomMenuItemProps) {
  return (
    <StyledItem
      {...(keyboardShortcut ? { 'aria-keyboardshortcuts': keyboardShortcut.ariaKeyshortcuts } : {})}
      active={active}
      disabled={disabled}
      startInlineIndent={startInlineIndent}
    >
      {icon ? <IconContainer>{icon}</IconContainer> : null}
      <div style={{ marginInlineEnd: 'auto' }}>
        <LabelContainer>{label}</LabelContainer>
        {description ? <DescriptionContainer>{description}</DescriptionContainer> : null}
      </div>
      {keyboardShortcut ? <KeyboardShortcut label={keyboardShortcut.label} /> : null}
    </StyledItem>
  );
}

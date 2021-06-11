import { styled } from '@storybook/theming';
import React, { forwardRef, HTMLAttributes, memo, ReactNode, RefObject } from 'react';
import { Icons, IconsProps } from '../icon/icon';

export type TabMenuItemProps = {
  id: string;
  Icon?: ReactNode;
  center?: ReactNode;
  highlighted?: boolean;
  icon?: IconsProps['icon'];
  iconPosition?: 'left' | 'right';
  label?: ReactNode;
  left?: ReactNode;
  menuItemRef?: RefObject<HTMLLIElement>;
  right?: ReactNode;
  selected?: boolean;
} & HTMLAttributes<HTMLLIElement>;

export const TabMenuItem = memo(
  forwardRef(
    (
      {
        Icon: IconComponent,
        center,
        highlighted,
        icon,
        iconPosition = 'left',
        id,
        label,
        left,
        menuItemRef,
        right,
        selected,
        ...rest
      }: TabMenuItemProps,
      ref: RefObject<HTMLLIElement>
    ) => {
      return (
        <Wrapper selected={selected} highlighted={highlighted} ref={menuItemRef || ref} {...rest}>
          <WrapperInner>
            {left !== undefined && <Left>{left}</Left>}
            {icon !== undefined && iconPosition === 'left' && <IconLeft icon={icon} />}
            {Icon !== undefined && iconPosition === 'left' && IconComponent}
            <Label>{label}</Label>
            <Center>{center}</Center>
            {Icon !== undefined && iconPosition === 'right' && IconComponent}
            {icon !== undefined && iconPosition === 'right' && <IconRight icon={icon} />}
            {right !== undefined && <Right>{right}</Right>}
          </WrapperInner>
        </Wrapper>
      );
    }
  )
);

interface WrapperProps {
  selected: boolean;
  highlighted: boolean;
}

const Wrapper = styled.li<WrapperProps>(({ theme, selected, highlighted }) => ({
  backgroundColor: selected || highlighted ? theme.color.secondary : 'transparent',
  color: selected || highlighted ? theme.color.inverseText : theme.color.defaultText,
  cursor: 'pointer',
  outline: '0 none',
  '&:hover': {
    backgroundColor: selected || highlighted ? theme.color.secondary : theme.background.hoverable,
  },
  '&:active,&:focus': {
    backgroundColor: theme.color.secondary,
    color: theme.color.inverseText,
  },
}));

const WrapperInner = styled.div({
  alignItems: 'center;',
  display: 'flex',
  height: 36,
  justifyContent: 'space-between',
  padding: '0 12px',
  width: '100%',
});

const Content = styled.div({
  alignItems: 'center',
  display: 'flex',
  fontSize: 10,
  minWidth: 14,
  justifyContent: 'center',
});

const Left = styled(Content)({
  marginRight: 8,
});

const Label = styled(Content)({
  fontSize: 13,
});

const Center = styled(Content)({
  flexGrow: 1,
  justifyContent: 'center',
});

const Right = styled(Content)({
  marginLeft: 8,
});

const Icon = styled(Icons)({
  height: 13,
  width: 13,
  fill: 'currentColor',
});

const IconLeft = styled(Icon)({ marginRight: 8 });

const IconRight = styled(Icon)({ marginLeft: 8 });

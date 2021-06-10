import React, {
  FC,
  HTMLAttributes,
  ReactNode,
  useState,
  useEffect,
  useRef,
  createRef,
} from 'react';
import { createPortal } from 'react-dom';
import { styled } from '@storybook/theming';
import { TabButton as BarButton, TabButtonProps as BarButtonProps } from '../bar/button';
import { IconsProps, Icons } from '../icon/icon';
import { icons } from '../icon/icons';
import { OnClickEvent } from './types';
import { useContentRect } from '../hooks/useContentRect';
import { TabsButtonMenu, TabsMenuItem } from './TabButtonMenu';

export type TabButtonProps = {
  id?: string;
  icon?: IconsProps['icon'] | ReactNode;
  label?: string;
  type?: 'content' | 'button' | 'menu';
  open?: boolean;
  menu?: TabsMenuItem[];
} & BarButtonProps &
  HTMLAttributes<HTMLButtonElement>;

export const TabButton: FC<TabButtonProps> = ({
  active,
  id,
  label: _label,
  icon,
  type,
  children,
  menu,
  open: _open,
  ...rest
}) => {
  const baseRectRef = useRef<HTMLDivElement>();
  const menuRectRef = createRef<HTMLDivElement>();
  const { x, y, width: baseRectWidth } = useContentRect(baseRectRef);
  const { width: menuRectWidth } = useContentRect(menuRectRef);
  const [open, setOpen] = useState(_open);
  let Icon: ReactNode = icon;

  useEffect(() => {
    if (open !== _open) {
      setOpen(open);
    }
  }, [_open]);

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

  return (
    <>
      <BarButton
        aria-selected={active ? 'true' : 'false'}
        aria-labelledby={labelId}
        role="tab"
        id={id}
        key={`${id}-tabbutton`}
        active={active || open}
        className={`tabbutton ${active ? 'tabbutton-active' : ''}`}
        {...rest}
        onClick={(event: OnClickEvent) => {
          if (rest.onClick) {
            rest.onClick(event as React.MouseEvent<HTMLButtonElement, MouseEvent>);
          }

          if (type === 'menu') {
            setOpen(!open);
          }
        }}
      >
        <Content ref={baseRectRef}>
          {Icon && <IconWrapper hasLabel={hasLabel}>{Icon}</IconWrapper>}
          <Label id={labelId} hasLabel={hasLabel}>
            {label}
          </Label>
        </Content>
      </BarButton>

      {type === 'menu' && (
        <TabsButtonMenu
          menu={menu}
          ref={menuRectRef}
          top={y + 32}
          left={x - (menuRectWidth - baseRectWidth) / 2}
        />
      )}
    </>
  );
};

const Content = styled.div({
  display: 'flex',
  alignItems: 'center',
});

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

interface MenuProps {
  open: boolean;
  top: number;
  left: number;
}

const Menu = styled.div<MenuProps>(({ theme, open, left, top }) => ({
  position: 'absolute',
  left,
  top,
  opacity: open ? 1 : 0,
  visibility: open ? 'visible' : 'hidden',
  backgroundColor: theme.background.content,
  boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
  borderRadius: theme.appBorderRadius,
  zIndex: 9999,
  overflow: 'hidden',
  // borderTop: `3px solid ${theme.color.secondary}`,
  minWidth: 180,
}));

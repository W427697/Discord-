import React, { FunctionComponent, useCallback, SyntheticEvent } from 'react';
import { styled } from '@storybook/theming';
import { document } from 'global';
import ListItem, { LinkWrapperType, ListItemProps } from './ListItem';

const List = styled.div<{}>(
  {
    minWidth: 180,
    overflow: 'hidden',
    overflowY: 'auto',
    maxHeight: 13.5 * 32, // 11.5 items
  },
  ({ theme }) => ({
    borderRadius: theme.appBorderRadius * 2,
  })
);

export interface Link extends Omit<ListItemProps, 'onClick'> {
  id: string;
  isGatsby?: boolean;
  onClick?: (event: SyntheticEvent, item: ListItemProps) => void;
}

export interface TooltipLinkListProps {
  links: Link[];
  LinkWrapper?: LinkWrapperType;
}

const Item: FunctionComponent<TooltipLinkListProps['links'][number]> = (props) => {
  const { LinkWrapper, onClick: onClickFromProps, ...rest } = props;
  const { title, href, active } = rest;
  const onClick = useCallback(
    (event: SyntheticEvent) => {
      onClickFromProps(event, rest);
    },
    [onClickFromProps]
  );

  const hasOnClick = !!onClickFromProps;

  return (
    <ListItem
      title={title}
      active={active}
      href={href}
      LinkWrapper={LinkWrapper}
      {...rest}
      {...(hasOnClick ? { onClick } : {})}
    />
  );
};

function nextItem(list: HTMLDivElement, item: HTMLElement): HTMLElement {
  if (list === item) {
    return list.firstChild as HTMLElement;
  }
  if (item && item.nextElementSibling) {
    return item.nextElementSibling as HTMLElement;
  }
  return list.firstChild as HTMLElement;
}

function previousItem(list: HTMLDivElement, item: HTMLElement): HTMLElement {
  if (list === item) {
    return list.lastChild as HTMLElement;
  }
  if (item && item.previousElementSibling) {
    return item.previousElementSibling as HTMLElement;
  }
  return list.lastChild as HTMLElement;
}

function moveFocus(
  list: HTMLDivElement,
  currentFocus: HTMLElement,
  traversalFunction: (list: HTMLDivElement, item: Element) => HTMLElement | null
) {
  let wrappedOnce = false;
  const nextFocus = traversalFunction(list, currentFocus);

  while (nextFocus) {
    // Prevent infinite loop.
    if (nextFocus === list.firstChild) {
      if (wrappedOnce) {
        return;
      }
      wrappedOnce = true;
    }

    nextFocus.focus();
    return;
  }
}

export const TooltipLinkList: FunctionComponent<TooltipLinkListProps> = ({
  links,
  LinkWrapper,
}) => {
  const listRef = React.useRef<HTMLDivElement>(null);

  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (event) => {
    const list = listRef.current;
    const { key } = event;
    const currentFocus = ((list && list.ownerDocument) || document).activeElement;

    if (key === 'ArrowDown') {
      // Prevent scroll of the page
      event.preventDefault();
      moveFocus(list, currentFocus, nextItem);
    } else if (key === 'ArrowUp') {
      event.preventDefault();
      moveFocus(list, currentFocus, previousItem);
    } else if (key === 'Home') {
      event.preventDefault();
      moveFocus(list, null, nextItem);
    } else if (key === 'End') {
      event.preventDefault();
      moveFocus(list, null, previousItem);
    }
  };

  return (
    <List ref={listRef} onKeyDown={handleKeyDown}>
      {links.map(({ isGatsby, ...p }, index) => (
        <Item
          key={p.id}
          LinkWrapper={isGatsby ? LinkWrapper : null}
          autoFocus={index === 0}
          {...p}
        />
      ))}
    </List>
  );
};

TooltipLinkList.defaultProps = {
  LinkWrapper: ListItem.defaultProps.LinkWrapper,
};

import { styled } from '@storybook/theming';
import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { Placeholder } from '../placeholder/placeholder';
import { ContentArea } from './components/ContentArea';
import { MenuArea } from './components/MenuArea';
import { OnChangeProps, OnSelectProps } from './types';
import {
  childrenToTabsItemProps,
  ChildrenToTabsItemProps,
} from './utils/children-to-tabs-items-props';
import { getListItemIndexById } from './utils/get-list-item-index-by-id';

export type TabsBarProps = {
  absolute?: boolean;
  backgroundColor?: string;
  bordered?: boolean;
  /** @info breaking change! index position instead of id's */
  initial?: number | string;
  rounded?: boolean;
  /** @info breaking change! index position instead of id's */
  selected?: number | string;
  tools?: React.ReactNode;
  onChange?: (state: OnChangeProps) => void;
  onSelect?: (state: OnSelectProps) => void;
  /** @deprecated use normal on_ events directly on props */
  actions?: {
    /** @deprecated use onSelect directly on props */
    onSelect?: (id: string) => void;
  };
} & React.HTMLAttributes<HTMLDivElement>;

export const TabsBar: FC<TabsBarProps> = ({
  backgroundColor,
  bordered,
  children,
  initial,
  rounded,
  selected,
  tools,
  actions,
  onChange,
  onSelect,
  ...rest
}) => {
  const [list, setList] = useState<ChildrenToTabsItemProps[]>(childrenToTabsItemProps(children));
  const [selectedIndex, setSelectedIndex] = useState<number>();
  const [scrollLeft, setScrollLeft] = useState<number>();
  const previousSelectedIndex = useRef<number>();

  const handleScroll = useCallback(
    (scroll: number) => {
      setScrollLeft(scroll);
    },
    [setScrollLeft]
  );

  const handleTabChange = useCallback(
    (changeProps: OnChangeProps) => {
      if (onChange) {
        onChange(changeProps);
      }

      const {
        selected: { index: current },
        previous: { index: previous },
      } = changeProps;
      previousSelectedIndex.current = previous;
      setSelectedIndex(current);
    },
    [onChange, setSelectedIndex]
  );

  const handleTabSelect = useCallback(
    (selectedProps: OnSelectProps) => {
      if (onSelect) {
        onSelect(selectedProps);
      }
    },
    [onSelect]
  );

  useEffect(() => {
    let index;

    if (initial !== undefined) {
      index = typeof initial === 'string' ? getListItemIndexById(initial, list) : initial;
    }

    setSelectedIndex(index);
  }, []);

  useEffect(() => {
    const newList = childrenToTabsItemProps(children);
    setList(newList);
  }, [children]);

  useEffect(() => {
    let index;

    if (selected !== undefined) {
      index = typeof selected === 'string' ? getListItemIndexById(selected, list) : selected;
    }

    if (index !== selectedIndex) {
      previousSelectedIndex.current = selectedIndex;
      setSelectedIndex(index);
    }
  }, [selected]);

  return list.length > 0 ? (
    <Wrapper bordered={bordered} rounded={rounded} {...rest}>
      <MenuArea
        list={list}
        selectedIndex={selectedIndex}
        previousSelectedIndex={previousSelectedIndex.current}
        scrollLeft={scrollLeft}
        tools={tools}
        bordered={selectedIndex === undefined ? false : bordered}
        backgroundColor={backgroundColor}
        onScroll={handleScroll}
        onTabChange={handleTabChange}
        onTabSelect={handleTabSelect}
      />
      <ContentArea
        list={list}
        selectedIndex={selectedIndex}
        previousSelectedIndex={previousSelectedIndex.current}
        bordered={bordered}
      />
    </Wrapper>
  ) : (
    <Placeholder>
      <React.Fragment key="title">Nothing found</React.Fragment>
    </Placeholder>
  );
};

export interface WrapperProps {
  bordered: boolean;
  rounded: boolean;
}

export const Wrapper = styled.div<WrapperProps>(
  ({ theme, bordered }) =>
    bordered
      ? {
          backgroundClip: 'padding-box',
          border: `1px solid ${theme.appBorderColor}`,
          overflow: 'hidden',
          boxSizing: 'border-box',
        }
      : {},
  ({ theme, rounded }) =>
    rounded && {
      borderRadius: theme.appBorderRadius,
    }
);

export interface TabBarProps {
  backgroundColor?: string;
  bordered: boolean;
}

export const TabBar = styled.div<TabBarProps>(({ theme, backgroundColor, bordered }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: backgroundColor || theme.background.content,
  borderBottom: bordered ? `1px solid ${theme.color.border}` : '0 none',
  overflowX: 'scroll',
  overflowY: 'hidden',
}));

/** @todo Old courtesy exports that needs to be removed */

export interface TabWrapperProps {
  active: boolean;
  render?: () => JSX.Element;
  children?: React.ReactNode;
}

export const TabWrapper: FC<TabWrapperProps> = ({ active, render, children }) => (
  <div aria-hidden={active ? 'false' : 'true'} hidden={!active}>
    {render ? render() : children}
  </div>
);

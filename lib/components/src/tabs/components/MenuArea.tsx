import { styled } from '@storybook/theming';
import React, { FC, MouseEvent, ReactNode, useCallback } from 'react';
import { TabBarItem, TabBarItemProps } from '../TabBarItem';
import { OnChangeProps, OnSelectProps } from '../types';
import { ChildrenToTabsItemProps } from '../utils/children-to-tabs-items-props';
import { createSelectedItem } from '../utils/create-selected-item';

type MenuAreaProps = {
  list: ChildrenToTabsItemProps[];
  previousSelectedIndex: number;
  scrollLeft: number;
  selectedIndex: number;
  tools: ReactNode;
  backgroundColor?: string;
  bordered?: boolean;
  onTabSelect: (props: OnSelectProps) => void;
  onTabChange: (props: OnChangeProps) => void;
  onScroll: (scrollLeft: number) => void;
};

export const MenuArea: FC<MenuAreaProps> = ({
  list,
  previousSelectedIndex,
  scrollLeft = 0,
  selectedIndex,
  tools,
  backgroundColor,
  bordered,
  onTabSelect,
  onTabChange,
  onScroll,
}) => {
  const handleScroll = useCallback(
    (event: React.UIEvent<HTMLDivElement, UIEvent>) => {
      onScroll(event.currentTarget.scrollLeft);
    },
    [onScroll]
  );

  return (
    <Wrapper
      role="tablist"
      bordered={selectedIndex === undefined ? false : bordered}
      backgroundColor={backgroundColor}
      onScroll={handleScroll}
    >
      <TabsArea>
        {list.map(({ title: _title, index, ...item }) => {
          const active = index === selectedIndex;
          const title = typeof _title === 'function' ? _title() : _title;

          let tabsItemProps: TabBarItemProps = {
            ...item,
            offsetX: scrollLeft,
            active,
            index,
            list,
            previousSelectedIndex,
            selectedIndex,
            title,
          };

          if (item.type === 'content') {
            tabsItemProps = {
              ...tabsItemProps,
              props: {
                ...tabsItemProps.props,
                onClick: (event: MouseEvent<HTMLButtonElement>) => {
                  event.persist();
                  event.preventDefault();

                  onTabSelect({
                    selected: createSelectedItem(list, index),
                    event,
                  });

                  onTabChange({
                    event,
                    previous: createSelectedItem(list, selectedIndex),
                    selected: createSelectedItem(list, index),
                  });
                },
              },
            };
          }

          return <TabBarItem key={item.id} {...tabsItemProps} />;
        })}
      </TabsArea>
      <ToolsArea>{tools}</ToolsArea>
    </Wrapper>
  );
};

export interface WrapperProps {
  backgroundColor?: string;
  bordered: boolean;
}

export const Wrapper = styled.div<WrapperProps>(({ theme, backgroundColor, bordered }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: backgroundColor || theme.background.content,
  borderBottom: bordered ? `1px solid ${theme.color.border}` : '0 none',
  overflowX: 'scroll',
  overflowY: 'hidden',
}));

const TabsArea = styled.div({
  display: 'flex',
  flexWrap: 'nowrap',
  flexShrink: 0,
  alignItems: 'center',
});

const ToolsArea = styled.div({
  display: 'flex',
  flexWrap: 'nowrap',
  flexShrink: 0,
  alignItems: 'center',
});

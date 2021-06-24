import { styled } from '@storybook/theming';
import React, { FC, MouseEvent, ReactNode, useCallback, useState } from 'react';
import { TabBarItem, TabBarItemProps } from '../TabBarItem';
import { ScrollArea } from '../../ScrollArea/ScrollArea';
import { ChildrenToTabsItemProps } from '../utils/children-to-tabs-items-props';
import { createSelectedItem } from '../utils/create-selected-item';
import { OnChangeProps, OnSelectProps } from '../types';

type MenuAreaProps = {
  list: ChildrenToTabsItemProps[];
  previousSelectedIndex: number;
  selectedIndex: number;
  tools: ReactNode;
  backgroundColor?: string;
  bordered?: boolean;
  onTabSelect: (props: OnSelectProps) => void;
  onTabChange: (props: OnChangeProps) => void;
};

export const MenuArea: FC<MenuAreaProps> = ({
  list,
  previousSelectedIndex,
  selectedIndex,
  tools,
  backgroundColor,
  bordered,
  onTabSelect,
  onTabChange,
}) => {
  const [scrollLeftValue, setScrollLeftValue] = useState(0);

  const handleScroll = useCallback(
    (event: React.UIEvent<HTMLDivElement, UIEvent>) => {
      const { scrollLeft } = event.currentTarget;

      setScrollLeftValue(scrollLeft);
    },
    [setScrollLeftValue]
  );

  return (
    <div>
      <ScrollArea onScroll={handleScroll}>
        <Wrapper
          role="tablist"
          bordered={selectedIndex === undefined ? false : bordered}
          backgroundColor={backgroundColor}
        >
          <TabsArea>
            {list.map(({ title: _title, index, ...item }) => {
              const active = index === selectedIndex;
              const title = typeof _title === 'function' ? _title() : _title;

              let tabsItemProps: TabBarItemProps = {
                ...item,
                offsetX: scrollLeftValue,
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
      </ScrollArea>
    </div>
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
  zIndex: 9999,
}));

const TabsArea = styled.div({
  display: 'flex',
  alignItems: 'center',
});

const ToolsArea = styled.div({
  display: 'flex',
  alignItems: 'center',
});

import React, { useState, useEffect, useRef, useCallback, memo, FC } from 'react';
import { styled } from '@storybook/theming';
import { FlexBar } from '../bar/bar';
import { Placeholder } from '../placeholder/placeholder';
import { OnClickEvent, TabChildRenderProps } from './types';
import {
  childrenToTabsItemProps,
  ChildrenToTabsItemProps,
} from './utils/children-to-tabs-items-props';
import { TabsBarItem, TabsBarItemProps } from './TabsBarItem';
import { getListItemIndexById } from './utils/get-list-item-index-by-id';

interface OnChangeProps {
  event: OnClickEvent;
  previous: ChildrenToTabsItemProps;
  selected: ChildrenToTabsItemProps;
}

interface OnSelectProps {
  selected: ChildrenToTabsItemProps;
  event: OnClickEvent;
}

export type TabsProps = {
  absolute?: boolean;
  tools?: React.ReactNode;
  /** @info breaking change! index position instead of id's */
  selected?: number | string;
  /** @info breaking change! index position instead of id's */
  initial?: number | string;
  backgroundColor?: string;
  bordered?: boolean;
  rounded?: boolean;
  onSelect?: (state: OnSelectProps) => void;
  onChange?: (state: OnChangeProps) => void;
  /** @deprecated use normal on_ events directly on props */
  actions?: {
    /** @deprecated use onSelect directly on props */
    onSelect?: (id: string) => void;
  };
} & React.HTMLAttributes<HTMLDivElement>;

export const Tabs: FC<TabsProps> = ({
  actions,
  backgroundColor,
  bordered,
  rounded,
  children,
  initial,
  selected,
  tools,
  onSelect,
  onChange,
  ...rest
}) => {
  const [list, setList] = useState<ChildrenToTabsItemProps[]>(childrenToTabsItemProps(children));
  const [selectedIndex, setSelectedIndex] = useState<number>();
  const previousSelectedIndex = useRef<number>();

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
      <FlexBar border backgroundColor={backgroundColor}>
        <TabBar role="tablist">
          {list.map(({ title: _title, index, ...item }) => {
            const active = index === selectedIndex;
            const title = typeof _title === 'function' ? _title() : _title;

            let tabsItemProps: TabsBarItemProps = {
              ...item,
              active,
              title,
              index,
              list,
              selectedIndex,
              previousSelectedIndex: previousSelectedIndex.current,
            };

            if (item.type === 'content') {
              tabsItemProps = {
                ...tabsItemProps,
                props: {
                  ...tabsItemProps.props,
                  onClick: (event: OnClickEvent) => {
                    event.preventDefault();

                    // Deprecation support
                    if (actions && actions.onSelect) {
                      actions.onSelect(item.id);
                    }

                    if (onSelect) {
                      onSelect({
                        selected: {
                          id: list[selectedIndex] ? list[selectedIndex].id : undefined,
                          color: list[selectedIndex] ? list[selectedIndex].color : undefined,
                          index: list[selectedIndex] ? list[selectedIndex].index : undefined,
                          content: list[selectedIndex] ? list[selectedIndex].content : undefined,
                          icon: list[selectedIndex] ? list[selectedIndex].icon : undefined,
                          type: list[selectedIndex] ? list[selectedIndex].type : undefined,
                          props: list[selectedIndex] ? list[selectedIndex].props : undefined,
                          ...(list[selectedIndex] ? list[selectedIndex] : {}),
                        },
                        event,
                      });
                    }

                    if (onChange) {
                      onChange({
                        event,
                        previous: {
                          id: list[previousSelectedIndex.current]
                            ? list[previousSelectedIndex.current].id
                            : undefined,
                          color: list[previousSelectedIndex.current]
                            ? list[previousSelectedIndex.current].color
                            : undefined,
                          index: list[previousSelectedIndex.current]
                            ? list[previousSelectedIndex.current].index
                            : undefined,
                          content: list[previousSelectedIndex.current]
                            ? list[previousSelectedIndex.current].content
                            : undefined,
                          icon: list[previousSelectedIndex.current]
                            ? list[previousSelectedIndex.current].icon
                            : undefined,
                          type: list[previousSelectedIndex.current]
                            ? list[previousSelectedIndex.current].type
                            : undefined,
                          props: list[previousSelectedIndex.current]
                            ? list[previousSelectedIndex.current].props
                            : undefined,
                          ...(list[previousSelectedIndex.current]
                            ? list[previousSelectedIndex.current]
                            : {}),
                        },
                        selected: {
                          id: list[selectedIndex] ? list[selectedIndex].id : undefined,
                          color: list[selectedIndex] ? list[selectedIndex].color : undefined,
                          index: list[selectedIndex] ? list[selectedIndex].index : undefined,
                          content: list[selectedIndex] ? list[selectedIndex].content : undefined,
                          icon: list[selectedIndex] ? list[selectedIndex].icon : undefined,
                          type: list[selectedIndex] ? list[selectedIndex].type : undefined,
                          props: list[selectedIndex] ? list[selectedIndex].props : undefined,
                          ...(list[selectedIndex] ? list[selectedIndex] : {}),
                        },
                      });
                    }

                    previousSelectedIndex.current = selectedIndex;
                    setSelectedIndex(index);
                  },
                },
              };
            }

            return <TabsBarItem key={item.id} {...tabsItemProps} />;
          })}
        </TabBar>
        {tools}
      </FlexBar>
      <TabContent bordered={bordered}>
        {list.length > 0
          ? list.map(({ content: _content, id, type, index }) => {
              const active = index === selectedIndex;
              let content = _content;

              if (typeof content === 'function') {
                const contentProxy = _content as (
                  renderProps: TabChildRenderProps
                ) => React.ReactNode;

                content = contentProxy({
                  id: `${id}-content`,
                  key: `${id}-content`,
                  active,
                  index,
                  selected: {
                    id: list[selectedIndex] ? list[selectedIndex].id : undefined,
                    color: list[selectedIndex] ? list[selectedIndex].color : undefined,
                    index: list[selectedIndex] ? list[selectedIndex].index : undefined,
                    content: list[selectedIndex] ? list[selectedIndex].content : undefined,
                    icon: list[selectedIndex] ? list[selectedIndex].icon : undefined,
                    type: list[selectedIndex] ? list[selectedIndex].type : undefined,
                    props: list[selectedIndex] ? list[selectedIndex].props : undefined,
                    ...(list[selectedIndex] ? list[selectedIndex] : {}),
                  },
                  previous: {
                    id: list[previousSelectedIndex.current]
                      ? list[previousSelectedIndex.current].id
                      : undefined,
                    color: list[previousSelectedIndex.current]
                      ? list[previousSelectedIndex.current].color
                      : undefined,
                    index: list[previousSelectedIndex.current]
                      ? list[previousSelectedIndex.current].index
                      : undefined,
                    content: list[previousSelectedIndex.current]
                      ? list[previousSelectedIndex.current].content
                      : undefined,
                    icon: list[previousSelectedIndex.current]
                      ? list[previousSelectedIndex.current].icon
                      : undefined,
                    type: list[previousSelectedIndex.current]
                      ? list[previousSelectedIndex.current].type
                      : undefined,
                    props: list[previousSelectedIndex.current]
                      ? list[previousSelectedIndex.current].props
                      : undefined,
                    ...(list[previousSelectedIndex.current]
                      ? list[previousSelectedIndex.current]
                      : {}),
                  },
                });
              }

              return type === 'content' ? (
                <div
                  aria-hidden={active ? 'false' : 'true'}
                  aria-labelledby={`${id}-label`}
                  role="tabpanel"
                  key={id}
                  hidden={!active}
                >
                  {content}
                </div>
              ) : null;
            })
          : null}
      </TabContent>
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

export const TabBar = styled.div({
  overflow: 'hidden',

  '&:first-of-type': {
    marginLeft: 0,
  },
});

export type TabContentProps = {
  bordered?: boolean;
};

const TabContent = styled.div<TabContentProps>(({ theme }) => ({
  fontSize: theme.typography.size.s2 - 1,
  background: theme.background.content,
  color: theme.color.defaultText,
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

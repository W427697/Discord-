import React, { FC } from 'react';
import { styled } from '@storybook/theming';
import { ChildrenToTabsItemProps } from '../utils/children-to-tabs-items-props';
import { TabChildRenderProps } from '../types';
import { createSelectedItem } from '../utils/create-selected-item';

type ContentAreaProps = {
  bordered: boolean;
  list: ChildrenToTabsItemProps[];
  selectedIndex: number | undefined;
  previousSelectedIndex?: number | undefined;
};

export const ContentArea: FC<ContentAreaProps> = ({
  list,
  bordered,
  selectedIndex,
  previousSelectedIndex,
}) => {
  return (
    <Wrapper bordered={bordered}>
      {list.length > 0
        ? list.map(({ children: _content, id, type, index }) => {
            const active = index === selectedIndex;
            let content = _content;

            if (typeof content === 'function') {
              const contentProxy = _content as (
                renderProps: TabChildRenderProps
              ) => React.ReactNode;

              content = contentProxy({
                active,
                id: `${id}-content`,
                index,
                key: `${id}-content`,
                previous: createSelectedItem(list, previousSelectedIndex),
                selected: createSelectedItem(list, selectedIndex),
              });
            }

            return type === 'content' ? (
              <div
                aria-hidden={active ? 'false' : 'true'}
                aria-labelledby={`${id}-label`}
                hidden={!active}
                key={id}
                role="tabpanel"
              >
                {content}
              </div>
            ) : null;
          })
        : null}
    </Wrapper>
  );
};

export type WrapperProps = {
  bordered?: boolean;
};

const Wrapper = styled.div<WrapperProps>(({ theme }) => ({
  fontSize: theme.typography.size.s2 - 1,
  background: theme.background.content,
  color: theme.color.defaultText,
}));

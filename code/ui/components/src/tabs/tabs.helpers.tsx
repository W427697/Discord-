import { styled } from '@storybook/theming';
import type { ReactChild, ReactFragment, ReactPortal } from 'react';
import React, { Children } from 'react';

export interface VisuallyHiddenProps {
  active?: boolean;
}

export const VisuallyHidden = styled.div<VisuallyHiddenProps>(({ active }: any) =>
  active ? { display: 'block' } : { display: 'none' }
);

export const childrenToList = (children: any, selected: string | undefined) =>
  Children.toArray(children).map(
    (value: ReactChild | ReactFragment | ReactPortal, index: number) => {
      if (React.isValidElement(value)) {
        const { title, id, color, children: childrenOfChild } = value.props;
        const content = Array.isArray(childrenOfChild) ? childrenOfChild[0] : childrenOfChild;

        return {
          active: selected ? id === selected : index === 0,
          title,
          id,
          color,
          render:
            typeof content === 'function'
              ? content
              : ({ active, key }: any) => (
                  <VisuallyHidden key={key} active={active} role="tabpanel">
                    {content}
                  </VisuallyHidden>
                ),
        };
      }
      return null; // Handle non-ReactElement values if needed
    }
  );

export type ChildrenList = ReturnType<typeof childrenToList>;

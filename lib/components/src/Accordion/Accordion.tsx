import React, { Children, useCallback, useEffect, useRef, useState } from 'react';
import { styled } from '@storybook/theming';
import { AccordionContext } from './AccordionContext';

import type { AddToMapFn, OpenMap } from './AccordionContext';

type AccordionMap = Record<string, { index: number; id: string }>;

interface StateChange {
  id: string;
  index: number;
}

export type AccordionProps = {
  allowMultipleOpen?: boolean;
  defaultOpen?: number | number[];
  bordered?: boolean;
  rounded?: boolean;
  lined?: boolean;
  onOpen?: (change: StateChange) => void;
  onClose?: (change: StateChange) => void;
} & React.HTMLAttributes<HTMLUListElement>;

/**
 *
 * Controlling wrapper component that will control the open/close functionality to
 * child ```<AccordionItem />```'s and style the other support components
 * ```<AccordionHeader />``` and ```<AccordionBody />```
 *
 * Although each component can work independently and be controlled from the outside
 * via an **open** prop, it is not recommended to use ```<AccordionItem />```,
 *  ```<AccordionHeader />``` and ```<AccordionBody />``` without this controller
 *
 * If no ```<AccordionBody />``` is inside an ```<AccordionItem />``` the open/close
 * functionality will be removed by default, as well as the icon and pointer cursor.
 */
export const Accordion = ({
  allowMultipleOpen,
  children,
  defaultOpen,
  rounded = false,
  bordered = false,
  lined = false,
  onOpen,
  onClose,
  ...rest
}: AccordionProps) => {
  const [open, setOpen] = useState<OpenMap>({});
  const itemMap = useRef<AccordionMap>({});
  const itemMapIndex = useRef(0);
  const openMap = useRef<OpenMap>({});

  const addToMap: AddToMapFn = useCallback(
    (id) => {
      const index = itemMapIndex.current + 1;
      itemMap.current = { ...itemMap.current, [id]: { id, index } };
      itemMapIndex.current = index;

      if (typeof defaultOpen === 'number') {
        openMap.current = { ...openMap.current, [id]: defaultOpen === index };
      } else if (Array.isArray(defaultOpen) && allowMultipleOpen) {
        const isExpanded = defaultOpen.includes(index);
        openMap.current = { ...openMap.current, [id]: isExpanded };
      } else {
        openMap.current = { ...openMap.current, [id]: false };
      }
    },
    [itemMap, openMap]
  );

  const onItemClose = useCallback(
    (id: string) => {
      setOpen({ ...open, [id]: false });

      if (onClose) {
        onClose({ id, index: itemMap.current[id].index });
      }
    },
    [open, setOpen, onClose, itemMap]
  );

  const onItemExpand = useCallback(
    (id: string) => {
      const newOpen = { ...open };
      let oldOpen: StateChange | undefined;

      if (allowMultipleOpen) {
        newOpen[id] = true;
      } else {
        Object.keys(open).forEach((key) => {
          if (open[key]) {
            oldOpen = { id: key, index: itemMap.current[key].index };
          }

          newOpen[key] = id === key;
        });
      }

      if (oldOpen) {
        onClose(oldOpen);
      }

      setOpen({ ...open, ...newOpen });

      if (onOpen) {
        onOpen({ id, index: itemMap.current[id].index });
      }
    },
    [open, setOpen, onOpen, itemMap]
  );

  useEffect(() => {
    if (Object.keys(itemMap.current).length === Children.count(children)) {
      setOpen({ ...open, ...openMap.current });
    }
  }, [itemMap, openMap]);

  return (
    <AccordionContext.Provider
      value={{ addToMap, onClose: onItemClose, onOpen: onItemExpand, open }}
    >
      <Wrapper data-sb-accordion="" bordered={bordered} rounded={rounded} lined={lined} {...rest}>
        {children}
      </Wrapper>
    </AccordionContext.Provider>
  );
};

type WrapperProps = {
  bordered: boolean;
  rounded: boolean;
  lined: boolean;
};

const Wrapper = styled.ul<WrapperProps>(
  ({ theme }) => ({
    overflow: 'hidden',
    listStyle: 'none',
    margin: 0,
    padding: 0,
    backgroundColor: theme.background.content,
  }),
  ({ theme, bordered }) =>
    bordered
      ? {
          border: `1px solid ${theme.appBorderColor}`,
        }
      : {},
  ({ theme, rounded }) =>
    rounded
      ? {
          borderRadius: theme.appBorderRadius,
        }
      : {},
  ({ theme, lined, bordered }) =>
    lined
      ? {
          '& > [data-sb-accordion-item]': {
            borderBottom: `1px solid ${theme.appBorderColor}`,
            '&:last-child': {
              borderBottomColor: bordered ? 'transparent' : theme.appBorderColor,
            },
            '&[aria-expanded="true"]': {
              '& > [data-sb-accordion-header]': {
                borderBottom: `1px solid ${theme.appBorderColor}`,
              },
            },
          },
        }
      : {},

  ({ theme }) => ({
    '& > [data-sb-accordion-item]': {
      '& > [data-sb-accordion-header]': {
        padding: 16,
        cursor: 'pointer',
        border: '1px solid transparent',
        '&:hover': {
          backgroundColor: theme.background.hoverable,
        },
      },
      '& > [data-sb-accordion-body]': {
        fontSize: 14,
      },
      '&[aria-expanded="true"]': {
        '& > [data-sb-accordion-body] > [data-sb-accordion-body-inner]': {
          padding: '16px 16px 16px 42px',
          backgroundColor: theme.background.app,
        },
      },
      '&[data-sb-state-prevent-expander="true"]': {
        '& > [data-sb-accordion-header]': {
          cursor: 'default',
        },
      },
    },
  })
);

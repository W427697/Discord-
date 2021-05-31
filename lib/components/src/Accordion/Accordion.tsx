import React, { Children, useCallback, useEffect, useRef, useState } from 'react';
import { css, styled } from '@storybook/theming';
import { AccordionContext } from './AccordionContext';

import type { AddToMapFn, OpenMap } from './AccordionContext';

type AccordionMap = Record<string, { index: number; id: string }>;

type StateChange = {
  id: string;
  index: number;
};

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
  onOpen = () => {},
  onClose = () => {},
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
      onClose({ id, index: itemMap.current[id].index });
    },
    [open, setOpen, onOpen, itemMap]
  );

  const onItemExpand = useCallback(
    (id: string) => {
      const newExpanded = { ...open };

      if (allowMultipleOpen) {
        newExpanded[id] = true;
      } else {
        Object.keys(open).forEach((key) => {
          newExpanded[key] = id === key;
        });
      }

      setOpen({ ...open, ...newExpanded });
      onOpen({ id, index: itemMap.current[id].index });
    },
    [open, setOpen]
  );

  useEffect(() => {
    if (Object.keys(itemMap.current).length === Children.count(children)) {
      setOpen({ ...open, ...openMap.current });
    }
  }, [itemMap.current, openMap.current]);

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

const Wrapper = styled.ul<WrapperProps>`
  overflow: hidden;
  list-style: none;
  margin: 0;
  padding: 0;

  ${({ theme, bordered }) =>
    bordered
      ? css`
          border: 1px solid ${theme.appBorderColor};
        `
      : null}

  ${({ theme, lined }) =>
    lined
      ? css`
          & [data-sb-accordion-item] {
            border-bottom: 1px solid ${theme.appBorderColor};

            &:last-child {
              border-bottom: 0 none;
            }

            &[aria-expanded='true'] {
              [data-sb-accordion-header] {
                border-bottom: 1px solid ${theme.appBorderColor};
              }
            }
          }
        `
      : null}

  ${({ theme, rounded }) =>
    rounded
      ? css`
          border-radius: ${theme.appBorderRadius}px;
        `
      : null}

  ${({ theme }) => css`
    background-color: ${theme.background.content};

    [data-sb-accordion-header] {
      padding: 16px;
    }

    [data-sb-accordion-body] {
      font-size: 14px;
    }

    [data-sb-accordion-item] {
      [data-sb-accordion-header] {
        cursor: pointer;
        &:hover {
          background-color: ${theme.background.hoverable};
        }
      }

      &[aria-expanded='true'] {
        [data-sb-accordion-body-inner] {
          padding: 16px 16px 16px 42px;
          background-color: ${theme.background.app};
        }
      }

      &[data-sb-state-prevent-expander='true'] {
        [data-sb-accordion-header] {
          cursor: default;
        }
      }
    }
  `}
`;

import React, { useCallback, useContext, useEffect, useRef, useState, Children } from 'react';
import { uniqueId } from 'lodash';
import { css, styled } from '@storybook/theming';
import { AccordionContext } from './AccordionContext';
import { AccordionItemContext } from './AccordionItemContext';

export type AccordionItemProps = {
  open?: boolean;
} & React.HTMLAttributes<HTMLLIElement>;

export const AccordionItem = ({ children, open: _open = false, ...rest }: AccordionItemProps) => {
  const [open, setOpen] = useState(_open);
  const context = useContext(AccordionContext);
  const id = useRef(uniqueId('AccordionItem-'));
  const preventOpen = Children.count(children) < 2;

  const onExpand = useCallback(() => {
    if (!preventOpen) {
      if (context !== null) {
        context.onOpen(id.current);
      } else {
        setOpen(true);
      }
    }
  }, [setOpen, context]);

  const onCollapse = useCallback(() => {
    if (!preventOpen) {
      if (context !== null) {
        context.onClose(id.current);
      } else {
        setOpen(false);
      }
    }
  }, [setOpen, context]);

  // If we have an accordion container context provider we need to register
  // this accordion item to work as a part of a team
  useEffect(() => {
    if (context !== null) {
      context.addToMap(id.current);
    }
  }, []);

  // Possible outside influences such as from prop or from context provider
  useEffect(() => {
    if (!preventOpen) {
      let newOpen = open;

      if (_open !== open) {
        newOpen = _open;
      }

      if (context !== null) {
        newOpen = context.open[id.current];
      }

      setOpen(newOpen);
    }
  }, [context, _open, preventOpen]);

  return (
    <AccordionItemContext.Provider
      value={{
        open: preventOpen ? false : open,
        onClose: onCollapse,
        onOpen: onExpand,
        id: id.current,
      }}
    >
      <Wrapper
        aria-labelledby={`${id.current}-label`}
        aria-expanded={open ? 'true' : 'false'}
        data-sb-accordion-item=""
        data-sb-state-prevent-expander={preventOpen ? 'true' : 'false'}
        preventOpen={preventOpen}
        {...rest}
      >
        {children}
      </Wrapper>
    </AccordionItemContext.Provider>
  );
};

type WrapperProps = {
  preventOpen: boolean;
};

const Wrapper = styled.li<WrapperProps>`
  padding: 0;
  margin: 0;
  list-style: none;

  ${({ preventOpen }) =>
    preventOpen
      ? css`
          [data-sb-accordion-expander] {
            display: none;
          }
        `
      : null}
`;

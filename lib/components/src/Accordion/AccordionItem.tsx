import React, { useCallback, useContext, useEffect, useRef, useState, Children } from 'react';
import { uniqueId } from 'lodash';
import { styled } from '@storybook/theming';
import { AccordionContext } from './AccordionContext';
import { AccordionItemContext } from './AccordionItemContext';

// Props are also available from Accordion context provider, but local props
// takes predecense for scope control
export type AccordionItemProps = {
  open?: boolean;
  indentBody?: boolean;
  lined?: boolean;
  narrow?: boolean;
  preventToggle?: boolean;
} & React.HTMLAttributes<HTMLLIElement>;

export const AccordionItem = ({
  children,
  open: _open,
  indentBody: _indentBody,
  narrow: _narrow,
  lined: _lined,
  preventToggle: _preventToggle,
  ...rest
}: AccordionItemProps) => {
  const [open, setOpen] = useState(_open);
  const context = useContext(AccordionContext);
  const id = useRef(uniqueId('AccordionItem-'));
  const preventOpen = Children.count(children) < 2;
  const initialOpen = useRef(_open);
  const allowDynamicOpen = !preventOpen && _open !== true;

  const onExpand = useCallback(() => {
    if (allowDynamicOpen) {
      if (context !== null) {
        context.onOpen(id.current);
      } else {
        setOpen(true);
      }
    }
  }, [setOpen, context]);

  const onCollapse = useCallback(() => {
    if (allowDynamicOpen) {
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
    if (allowDynamicOpen) {
      let newOpen = open;

      if (_open !== open) {
        newOpen = _open;
      }

      if (context !== null) {
        newOpen = context.openState[id.current];
      }

      setOpen(newOpen);
    }
  }, [context, _open, preventOpen]);

  let indentBody = _indentBody;
  let narrow = _narrow;
  let lined = _lined;
  let preventToggle = _preventToggle;
  let bordered = false;

  if (context) {
    indentBody = _indentBody === true ? true : context.indentBody;
    narrow = _narrow === true ? true : context.narrow;
    lined = _lined === true ? true : context.lined;
    preventToggle = _preventToggle === true ? true : context.preventToggle || initialOpen.current;
    bordered = context.bordered;
  }

  return (
    <AccordionItemContext.Provider
      value={{
        id: id.current,
        open,
        preventOpen,
        preventToggle,
        onClose: onCollapse,
        onOpen: onExpand,
      }}
    >
      <Wrapper
        aria-labelledby={`${id.current}-label`}
        aria-expanded={open ? 'true' : 'false'}
        data-sb-accordion-item=""
        bordered={bordered}
        lined={lined}
        indentBody={indentBody}
        narrow={narrow}
        preventOpen={preventOpen}
        {...rest}
      >
        {children}
      </Wrapper>
    </AccordionItemContext.Provider>
  );
};

interface WrapperProps {
  bordered: boolean;
  lined: boolean;
  indentBody: boolean;
  preventOpen: boolean;
  narrow: boolean;
}

const Wrapper = styled.li<WrapperProps>(
  {
    padding: 0,
    margin: 0,
    listStyle: 'none',
  },
  ({ preventOpen }) =>
    preventOpen && {
      '& > [data-sb-accordion-header]': {
        cursor: 'default',
      },
    },
  ({ theme, narrow, indentBody }) => ({
    '& > [data-sb-accordion-header]': {
      padding: narrow ? '12px 10px' : 16,
      fontSize: narrow ? 13 : 16,
      borderTop: '1px solid transparent',
      borderBottom: '1px solid transparent',
      borderLeft: '0 none',
      borderRight: '0 none',
      '[data-sb-accordion-expander-wrapper]': {
        marginRight: narrow ? 10 : 12,
        paddingTop: 1,
        '[data-sb-accordion-expander]': {
          minWidth: narrow ? 14 : 18,
          minHeight: narrow ? 14 : 18,
          width: narrow ? 14 : 18,
          height: narrow ? 14 : 18,
        },
        '[data-sb-accordion-chevron]': {
          width: narrow ? 10 : 12,
          height: narrow ? 10 : 12,
        },
      },
      '&:hover': {
        backgroundColor: theme.background.hoverable,
      },
    },
    '& > [data-sb-accordion-body]': {
      fontSize: narrow ? 13 : 14,
    },
    '&[aria-expanded="true"]': {
      '& > [data-sb-accordion-body] > [data-sb-accordion-body-inner]': {
        padding: narrow
          ? `20px 10px 20px ${indentBody ? '34px' : '10px'}`
          : `24px 16px 24px ${indentBody ? '46px' : '16px'}`,
        backgroundColor: theme.background.app,
      },
    },
  }),
  ({ theme, lined, bordered }) =>
    lined
      ? {
          borderBottom: `1px solid ${theme.appBorderColor}`,
          '&:last-child': {
            borderBottomWidth: bordered ? 0 : 1,
          },
          '&[aria-expanded="true"]': {
            '& > [data-sb-accordion-header]': {
              borderBottom: `1px solid ${theme.appBorderColor}`,
            },
          },
        }
      : {}
);

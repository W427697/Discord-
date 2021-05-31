import React, { useContext, useEffect, useRef, useState } from 'react';
import { css, styled } from '@storybook/theming';
import { Icons } from '../icon/icon';
import { AccordionItemContext } from './AccordionItemContext';

export type AccordionHeaderProps = {
  open?: boolean;
  label?: string;
  Icon?: React.ReactNode;
  LabelProps?: React.HTMLAttributes<HTMLDivElement>;
} & React.HTMLAttributes<HTMLButtonElement>;

export const AccordionHeader = ({
  label,
  open: _open = false,
  children,
  Icon,
  LabelProps: _LabelProps = {},
  ...rest
}: AccordionHeaderProps) => {
  const [open, setOpen] = useState(_open);
  const context = useContext(AccordionItemContext);
  const id = useRef('');

  const handleOnClick = () => {
    if (context !== null) {
      if (open) {
        context.onClose();
      } else {
        context.onOpen();
      }
    } else {
      setOpen(!open);
    }
  };

  useEffect(() => {
    if (_open !== open) {
      setOpen(_open);
    }
  }, [_open]);

  useEffect(() => {
    if (context !== null) {
      if (context.open !== open) {
        setOpen(context.open);
      }

      id.current = `${context.id}-label`;
    }
  }, [context, setOpen]);

  const LabelProps: React.HTMLAttributes<HTMLDivElement> = { ..._LabelProps };

  if (id.current) {
    LabelProps.id = id.current;
  }

  return (
    <Wrapper data-sb-accordion-header="" role="button" onClick={handleOnClick} {...rest}>
      <Expander data-sb-accordion-expander="" open={open}>
        {Icon !== undefined ? (
          Icon
        ) : (
          <Icons icon="chevrondown" style={{ transform: 'rotate(-90deg)' }} />
        )}
      </Expander>
      <Label data-sb-accordion-label="" {...LabelProps}>
        {label || children}
      </Label>
    </Wrapper>
  );
};

const Wrapper = styled.button`
  display: flex;
  align-items: center;
  padding: 0;
  margin: 0;
  border: 0 none;
  width: 100%;
  text-align: left;
  background-color: transparent;
  border-radius: 0;
  box-sizing: border-box;
`;

type ExpanderProps = {
  open: boolean;
};

const Expander = styled.div<ExpanderProps>`
  ${({ theme, open }) => css`
    color: ${theme.color.mediumdark};
    width: 10px;
    min-width: 10px;
    min-height: 10px;
    max-width: 10px;
    max-height: 10px;
    height: 10px;
    margin-right: 16px;
    margin-top: 5px;
    transform: rotate(${open ? 90 : 0}deg);
    transition: transform 0.1s ease-in-out;
    align-self: flex-start;
  `}
`;

const Label = styled.div(({ theme }) => ({
  color: theme.color.defaultText,
}));

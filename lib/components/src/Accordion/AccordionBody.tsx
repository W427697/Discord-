import React, { useContext } from 'react';
import { styled } from '@storybook/theming';
import { AccordionItemContext } from './AccordionItemContext';

export type AccordionBodyProps = {
  open?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

export const AccordionBody = ({ children, open: _open, ...rest }: AccordionBodyProps) => {
  const context = useContext(AccordionItemContext);

  let open = _open;

  // eslint-disable-next-line react/destructuring-assignment
  if (context !== null && context.open !== open) {
    open = context.open;
  }

  return (
    <Wrapper data-sb-accordion-body="" {...rest}>
      <InnerWrapper data-sb-accordion-body-inner="" open={open}>
        {children}
      </InnerWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  overflow: hidden;
`;

type InnerWrapperProps = {
  open: boolean;
};

const InnerWrapper = styled.div<InnerWrapperProps>(({ open, theme }) => ({
  height: open ? 'auto' : 0,
  display: open ? 'block' : 'none',
  transition: `height 175ms ease-in-out`,
  color: theme.color.defaultText,
}));

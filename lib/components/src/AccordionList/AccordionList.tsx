import React from 'react';
import { css, styled } from '@storybook/theming';
import { Accordion } from '../Accordion/Accordion';

import type { AccordionProps } from '../Accordion/Accordion';

export type AccordionListProps = {} & AccordionProps;

/**
 * An extension of the ```<Accordion />``` component that is well suited for usage
 * in situations where a more list or tabular presentation is required, like for
 * **addon panels** like @storybook/a11y & @storybook/test
 *
 * By default the props **lined** and **allowMultipleOpen** are set to true, but can be
 * overridden
 */
export const AccordionList = ({
  allowMultipleOpen = true,
  lined = true,
  children,
  ...rest
}: AccordionListProps) => {
  return (
    <Wrapper lined={lined} allowMultipleOpen={allowMultipleOpen} {...rest}>
      {children}
    </Wrapper>
  );
};

const Wrapper = styled(Accordion)`
  & > [data-sb-accordion-item] {
    & > [data-sb-accordion-header] {
      font-size: 13px;
      padding: 12px 15px 12px 10px;

      & > [data-sb-accordion-expander] {
        margin-right: 10px;
        margin-top: 3px;
      }
    }

    & > [data-sb-accordion-body] {
      font-size: 13px;
    }

    &[aria-expanded='true'] {
      & > [data-sb-accordion-body] > [data-sb-accordion-body-inner] {
        padding: 16px 15px 16px 30px;
      }
    }
  }

  ${({ theme }) => css`
    & > [data-sb-accordion-item] {
      &:last-child {
        border-bottom: 1px solid ${theme.appBorderColor};
      }
  `}
`;

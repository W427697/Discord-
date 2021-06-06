import React from 'react';
import { styled } from '@storybook/theming';
import {
  Placeholder,
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionBody,
} from '@storybook/components';
import { ReportHeader } from './ReportHeader';
import { ReportDetails } from './ReportDetails';
import { HighlightToggle, HighlightWrapper } from './GlobalHighlight';

/* eslint-disable import/order */
import type { Result } from 'axe-core';
import type { RuleType } from '../A11yContext';

export type ReportListProps = {
  items: Result[];
  empty: string;
  type: RuleType;
};

export const Report = ({ items, empty, type }: ReportListProps) => (
  <Accordion narrow allowMultipleOpen lined indentBody>
    {items && items.length > 0 ? (
      items.map((item, index) => {
        const highlightToggleId = `${type}-${item.id}`;

        return (
          <AccordionItem key={`${type}:${item.id}:${index + 1}`}>
            <AccordionHeader>
              <Label>
                <div>{item.description}</div>
                <div>
                  <HighlightWrapper>
                    <HighlightToggle
                      toggleId={highlightToggleId}
                      elementsToHighlight={item.nodes}
                    />
                  </HighlightWrapper>
                </div>
              </Label>
            </AccordionHeader>
            <AccordionBody>
              <Body>
                <BodyHeader>
                  <ReportHeader item={item} />
                </BodyHeader>
                <ReportDetails elements={item.nodes} type={type} />
              </Body>
            </AccordionBody>
          </AccordionItem>
        );
      })
    ) : (
      <Placeholder key="placeholder">{empty}</Placeholder>
    )}
  </Accordion>
);

const Label = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  paddingRight: -1,
});

const Body = styled.div({
  paddingRight: 24,
});

const BodyHeader = styled.div({
  marginBottom: 10,
});

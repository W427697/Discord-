import React from 'react';

import { styled } from '@storybook/theming';
import { AccordionItem, AccordionHeader, AccordionBody } from '@storybook/components';

import { Result } from 'axe-core';
import { ReportHeader } from './ReportHeader';
import { ReportDetails } from './ReportDetails';
import { RuleType } from '../A11YPanel';
import HighlightToggle from './HighlightToggle';

interface ReprotItemProps {
  item: Result;
  type: RuleType;
}

export const ReportItem = ({ item, type }: ReprotItemProps) => {
  const highlightToggleId = `${type}-${item.id}`;

  return (
    <AccordionItem>
      <AccordionHeader>
        <Label>
          <div>{item.description}</div>
          <div>
            <HighlightToggleWrapper>
              <HighlightToggle toggleId={highlightToggleId} elementsToHighlight={item.nodes} />
            </HighlightToggleWrapper>
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
};

const Label = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  paddingRight: 5,
});

const Body = styled.div({
  paddingRight: 24,
});

const BodyHeader = styled.div({
  marginBottom: 10,
});

const HighlightToggleWrapper = styled.span({
  alignSelf: 'center',
  position: 'relative',
  top: 1,
  input: {
    margin: '0 0 0 10px',
    display: 'block',
  },
});

import React, { useRef, useState } from 'react';
import { uniqueId } from 'lodash';
import { styled } from '@storybook/theming';
import {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionBody,
  Icons,
  IconKey,
} from '@storybook/components';
import { ReportRuleList } from './ReportRulesList';
import { RuleType } from '../A11yContext';
import { HighlightToggle, HighlightWrapper } from './GlobalHighlight';
import { ADDON_ID } from '../constants';

/* eslint-disable import/order */
import type { NodeResult } from 'axe-core';

const createKeyArray = (length: number) => {
  const keyArray: number[] = [];
  let i = 0;

  // eslint-disable-next-line no-plusplus
  for (i; i < length; i++) {
    // Plus 2 because we have a header in the list that is not expandable
    keyArray.push(i + 2);
  }

  return keyArray;
};

const iconMap: Record<RuleType, IconKey> = {
  0: 'facesad',
  1: 'facehappy',
  2: 'faceneutral',
};

export type ElementsProps = {
  elements: NodeResult[];
  type: RuleType;
};

export const ReportDetails = ({ elements, type }: ElementsProps) => {
  const allOpenIds = createKeyArray(elements.length || 0);

  const id = `${ADDON_ID}-report-details`;
  const keyRef = useRef(uniqueId(id));
  const [openIds, setOpenIds] = useState<number[]>([...allOpenIds]);

  const icon = iconMap[type];

  return (
    <Accordion narrow lined rounded bordered allowMultipleOpen indentBody open={openIds}>
      <AccordionItem preventToggle>
        <AccordionHeader Icon={<Icons icon={icon} />}>
          <ControlWrapper>
            <div>Details</div>
            <Controls>
              <Icons
                aria-label="Expand All"
                icon="expandalt"
                onClick={() => {
                  setOpenIds([...allOpenIds]);
                }}
              />
              <Icons
                aria-label="Collapse All"
                icon="collapse"
                onClick={() => {
                  setOpenIds([]);
                }}
              />
            </Controls>
          </ControlWrapper>
        </AccordionHeader>
      </AccordionItem>
      {elements.map((element, index) => {
        const key = `${keyRef.current}-${index}`;
        const { any, all, none } = element;
        const rules = [...any, ...all, ...none];
        const highlightToggleId = `${type}-${element.target[0]}`;

        return (
          <AccordionItem key={key}>
            <AccordionHeader>
              <Label>
                <div>
                  {index + 1}. {element.target[0]}
                </div>
                <div>
                  <HighlightWrapper>
                    <HighlightToggle toggleId={highlightToggleId} elementsToHighlight={[element]} />
                  </HighlightWrapper>
                </div>
              </Label>
            </AccordionHeader>
            <AccordionBody style={{ backgroundColor: 'transparent' }}>
              <ReportRuleList rules={rules} />
            </AccordionBody>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};

const Label = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  paddingRight: 5,
  fontWeight: 500,
});

const ControlWrapper = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

const Controls = styled.div({
  display: 'flex',
  alignItems: 'center',
  '& > svg': {
    marginRight: 6,
    marginLeft: 6,
    cursor: 'pointer',
    width: 12,
    height: 12,
  },
});

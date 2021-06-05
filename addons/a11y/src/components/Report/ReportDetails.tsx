import React, { useRef, useState } from 'react';
import { uniqueId } from 'lodash';
import { styled } from '@storybook/theming';
import {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionBody,
  Icons,
} from '@storybook/components';
import { NodeResult } from 'axe-core';

import { ReportRuleList } from './ReportRulesList';
import { RuleType } from '../A11YPanel';
import HighlightToggle from './HighlightToggle';
import { ADDON_ID } from '../../constants';

export type ElementsProps = {
  elements: NodeResult[];
  type: RuleType;
};

export const ReportDetails = ({ elements, type }: ElementsProps) => {
  const id = `${ADDON_ID}-report-details`;
  const keyRef = useRef(uniqueId(id));
  const [openIds, setOpenIds] = useState([]);

  return (
    <Accordion narrow lined rounded bordered allowMultipleOpen indentBody defaultOpen={openIds}>
      <AccordionItem>
        <AccordionHeader Icon={<Icons icon="batchaccept" />}>
          <ControlWrapper>
            <div>Details</div>
            <Controls>
              <Icons
                icon="collapse"
                onClick={() => {
                  setOpenIds([]);
                }}
              />
              <Icons icon="expand" />
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
                  <HighlightToggleElement>
                    <HighlightToggle toggleId={highlightToggleId} elementsToHighlight={[element]} />
                  </HighlightToggleElement>
                </div>
              </Label>
            </AccordionHeader>
            <AccordionBody>
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

const HighlightToggleElement = styled.span({
  fontWeight: 'normal',
  alignSelf: 'center',
  input: {
    margin: '0 0 0 10px',
    display: 'block',
  },
});

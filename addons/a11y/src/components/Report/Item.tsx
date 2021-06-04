import React from 'react';

import { styled } from '@storybook/theming';
import { AccordionItem, AccordionHeader, AccordionBody } from '@storybook/components';

import { Result } from 'axe-core';
import { Info } from './Info';
import { Elements } from './Elements';
import { RuleType } from '../A11YPanel';
import HighlightToggle from './HighlightToggle';

const HighlightToggleElement = styled.span({
  alignSelf: 'center',
  position: 'relative',
  top: 2,
  input: {
    margin: '0 0 0 10px',
    display: 'block',
  },
});

interface ItemProps {
  item: Result;
  type: RuleType;
}

// export class Item extends Component<ItemProps, ItemState> {
export const Item = (props: ItemProps) => {
  const { item, type } = props;
  const highlightToggleId = `${type}-${item.id}`;

  return (
    <AccordionItem>
      <AccordionHeader>
        <AccordionLabel>
          <div>{item.description}</div>
          <div>
            <HighlightToggleElement>
              <HighlightToggle toggleId={highlightToggleId} elementsToHighlight={item.nodes} />
            </HighlightToggleElement>
          </div>
        </AccordionLabel>
      </AccordionHeader>
      <AccordionBody>
        <Info item={item} key="info" />
        <Elements elements={item.nodes} type={type} key="elements" />
      </AccordionBody>
    </AccordionItem>
  );
};

const AccordionLabel = styled.div`
  display: flex;
  justify-content: space-between;
`;

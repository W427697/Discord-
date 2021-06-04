import React, { FunctionComponent } from 'react';

import { styled } from '@storybook/theming';

import { NodeResult } from 'axe-core';
import { Rules } from './Rules';
import { RuleType } from '../A11YPanel';
import HighlightToggle from './HighlightToggle';

const Item = styled.li(({ theme }) => ({
  fontWeight: 600,
  marginBottom: 10,
  borderBottom: `1px solid ${theme.appBorderColor}`,
}));

const ItemTitle = styled.span(() => ({
  width: '100%',
  display: 'flex',
  paddingBottom: 6,
  marginBottom: 6,
  justifyContent: 'space-between',
}));

const HighlightToggleElement = styled.span({
  fontWeight: 'normal',
  alignSelf: 'center',
  input: {
    margin: '0 0 0 10px',
    display: 'block',
  },
});

interface ElementProps {
  element: NodeResult;
  type: RuleType;
}

const Element: FunctionComponent<ElementProps> = ({ element, type }) => {
  const { any, all, none } = element;
  const rules = [...any, ...all, ...none];
  const highlightToggleId = `${type}-${element.target[0]}`;

  return (
    <Item>
      <ItemTitle>
        {element.target[0]}
        <HighlightToggleElement>
          <HighlightToggle toggleId={highlightToggleId} elementsToHighlight={[element]} />
        </HighlightToggleElement>
      </ItemTitle>
      <Rules rules={rules} />
    </Item>
  );
};

interface ElementsProps {
  elements: NodeResult[];
  type: RuleType;
}

export const Elements: FunctionComponent<ElementsProps> = ({ elements, type }) => (
  <ElementWrapper>
    {elements.map((element, index) => (
      // eslint-disable-next-line react/no-array-index-key
      <Element element={element} key={index} type={type} />
    ))}
  </ElementWrapper>
);

const ElementWrapper = styled.ol`
  padding: 0 0 0 32px;
  margin: 0;
`;

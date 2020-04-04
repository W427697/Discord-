import * as React from 'react';
import { document } from 'global';
import memoize from 'memoizerific';
import { themes, convert } from '@storybook/theming';
import { NodeResult } from 'axe-core';

import { HighlightedElementData } from './Report/HighlightToggle';
import { IFRAME } from '../constants';
import { RuleType } from './A11YPanel';

interface A11yContextStore {
  onToggleElements: (elementsToToggle: NodeResult[], highlight: boolean, type: RuleType) => void;
  highlightedElementsMap: Map<HTMLElement, HighlightedElementData>;
  addElement: (element: HTMLElement, data: HighlightedElementData) => void;
  clearElements: () => void;
}

const colorsByType = [
  convert(themes.normal).color.negative, // VIOLATION,
  convert(themes.normal).color.positive, // PASS,
  convert(themes.normal).color.warning, // INCOMPLETION,
];

const A11yContext = React.createContext<A11yContextStore>({
  highlightedElementsMap: new Map<HTMLElement, HighlightedElementData>(),
  addElement: () => {},
  onToggleElements: () => {},
  clearElements: () => {},
});

const getIframe = memoize(1)(() => document.getElementsByTagName(IFRAME)[0]);

function getElementBySelectorPath(elementPath: string): HTMLElement {
  const iframe = getIframe();
  if (iframe && iframe.contentDocument && elementPath) {
    return iframe.contentDocument.querySelector(elementPath);
  }
  return (null as unknown) as HTMLElement;
}

const highlightRuleLocation = (
  targetElement: HTMLElement,
  addHighlight: boolean,
  originalOutline: string,
  type: RuleType
): void => {
  // eslint-disable-next-line no-param-reassign
  targetElement.style.outline = addHighlight ? `${colorsByType[type]} dotted 1px` : originalOutline;
};

export const A11yContextProvider: React.FC = (props) => {
  const [highlightedElementsMap, setHighlightedElementsMap] = React.useState(
    new Map<HTMLElement, HighlightedElementData>()
  );
  const handleAddElement = React.useCallback(
    (element: HTMLElement, data: HighlightedElementData) => {
      setHighlightedElementsMap(new Map(highlightedElementsMap.set(element, data)));
    },
    [highlightedElementsMap]
  );
  const handleToggleElements = React.useCallback(
    (elementsToToggle: NodeResult[], highlight: boolean, type: RuleType) => {
      const updatedMap = new Map(highlightedElementsMap);
      elementsToToggle.forEach((element) => {
        const targetElement = getElementBySelectorPath(element.target[0]);
        if (!highlightedElementsMap.has(targetElement)) {
          return;
        }
        const { originalOutline } = highlightedElementsMap.get(
          targetElement
        ) as HighlightedElementData;
        updatedMap.set(targetElement, { originalOutline, isHighlighted: highlight });
        highlightRuleLocation(targetElement, highlight, originalOutline, type);
      });
      setHighlightedElementsMap(updatedMap);
    },
    [highlightedElementsMap]
  );
  const handleClear = React.useCallback(() => {
    // eslint-disable-next-line no-restricted-syntax
    for (const key of Array.from(highlightedElementsMap.keys())) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const itemInMap = highlightedElementsMap.get(key)!;
      key.style.outline = itemInMap.originalOutline;
    }
    setHighlightedElementsMap(new Map());
  }, [highlightedElementsMap]);
  return (
    <A11yContext.Provider
      value={{
        highlightedElementsMap,
        addElement: handleAddElement,
        onToggleElements: handleToggleElements,
        clearElements: handleClear,
      }}
      {...props}
    />
  );
};

export const useA11yContext = () => React.useContext(A11yContext);

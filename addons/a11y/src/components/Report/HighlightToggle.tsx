import { document } from 'global';
import * as React from 'react';
import { styled } from '@storybook/theming';
import memoize from 'memoizerific';

import { NodeResult } from 'axe-core';
import { RuleType } from '../A11YPanel';
import { IFRAME } from '../../constants';
import { useA11yContext } from '../A11yContext';

export interface HighlightedElementData {
  originalOutline: string;
  isHighlighted: boolean;
}

interface ToggleProps {
  elementsToHighlight: NodeResult[];
  type: RuleType;
  toggleId?: string;
}

enum CheckBoxStates {
  CHECKED,
  UNCHECKED,
  INDETERMINATE,
}

const Checkbox = styled.input<{ disabled: boolean }>(({ disabled }) => ({
  cursor: disabled ? 'not-allowed' : 'pointer',
}));

const getIframe = memoize(1)(() => document.getElementsByTagName(IFRAME)[0]);

function getElementBySelectorPath(elementPath: string): HTMLElement {
  const iframe = getIframe();
  if (iframe && iframe.contentDocument && elementPath) {
    return iframe.contentDocument.querySelector(elementPath);
  }
  return (null as unknown) as HTMLElement;
}

function areAllRequiredElementsHighlighted(
  elementsToHighlight: NodeResult[],
  highlightedElementsMap: Map<HTMLElement, HighlightedElementData>
): CheckBoxStates {
  const highlightedCount = elementsToHighlight.filter((item) => {
    const targetElement = getElementBySelectorPath(item.target[0]);
    return (
      highlightedElementsMap.has(targetElement) &&
      (highlightedElementsMap.get(targetElement) as HighlightedElementData).isHighlighted
    );
  }).length;

  // eslint-disable-next-line no-nested-ternary
  return highlightedCount === 0
    ? CheckBoxStates.UNCHECKED
    : highlightedCount === elementsToHighlight.length
    ? CheckBoxStates.CHECKED
    : CheckBoxStates.INDETERMINATE;
}

const HighlightToggle: React.FC<ToggleProps> = ({ toggleId, elementsToHighlight = [], type }) => {
  const { highlightedElementsMap, addElement, onToggleElements } = useA11yContext();
  const checkBoxRef = React.useRef<HTMLInputElement>(null);
  const [checkBoxState, setChecked] = React.useState(
    areAllRequiredElementsHighlighted(elementsToHighlight, highlightedElementsMap)
  );

  React.useEffect(() => {
    elementsToHighlight.forEach((element) => {
      const targetElement = getElementBySelectorPath(element.target[0]);
      if (targetElement && !highlightedElementsMap.has(targetElement)) {
        addElement(targetElement, {
          isHighlighted: false,
          originalOutline: targetElement.style.outline,
        });
      }
    });
  }, []);

  React.useEffect(() => {
    const newState = areAllRequiredElementsHighlighted(elementsToHighlight, highlightedElementsMap);
    if (checkBoxRef.current) {
      checkBoxRef.current.indeterminate = newState === CheckBoxStates.INDETERMINATE;
    }
    setChecked(newState);
  }, [elementsToHighlight, highlightedElementsMap]);

  const handleToggle = React.useCallback((): void => {
    onToggleElements(elementsToHighlight, checkBoxState !== CheckBoxStates.CHECKED, type);
  }, [elementsToHighlight, checkBoxState, type, onToggleElements]);

  return (
    <Checkbox
      ref={checkBoxRef}
      id={toggleId}
      type="checkbox"
      aria-label="Highlight result"
      disabled={!elementsToHighlight.length}
      onChange={handleToggle}
      checked={checkBoxState === CheckBoxStates.CHECKED}
    />
  );
};

export default HighlightToggle;

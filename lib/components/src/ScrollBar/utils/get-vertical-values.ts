import { RefObject } from 'react';
import { getStateValues } from './get-state-values';

interface GetVerticalValues {
  scrollTop: number;
  outerHeight: number;
  innerHeight: number;
  showHorizontal: boolean;
  showVertical: boolean;
  sliderSafeSpacing: number;
  sliderSafePadding: number;
  outerRef: RefObject<HTMLDivElement>;
}

export const getVerticalValues = ({
  scrollTop,
  outerHeight,
  innerHeight,
  showHorizontal,
  showVertical,
  sliderSafeSpacing,
  sliderSafePadding,
  outerRef,
}: GetVerticalValues) => {
  // Borders mess with scroll values
  let borderOffset = 0;

  if (outerRef.current) {
    try {
      const borderTop = Number(
        outerRef.current.style.borderTopWidth.replace(/[^0-9.]/gi, '') || '0'
      );
      const borderBottom = Number(
        outerRef.current.style.borderBottomWidth.replace(/[^0-9.]/gi, '') || '0'
      );
      borderOffset = borderTop + borderBottom;
      // eslint-disable-next-line no-empty
    } catch (e) {}
  }

  return getStateValues({
    scroll: scrollTop,
    outerSize: outerHeight,
    innerSize: innerHeight,
    show: showVertical,
    sliderSafeSpacing: showHorizontal ? sliderSafeSpacing : sliderSafePadding * 2,
    borderOffset,
  });
};

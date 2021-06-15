import { RefObject } from 'react';
import { getStateValues } from './get-state-values';

interface GetHorizontalValues {
  scrollLeft: number;
  outerWidth: number;
  innerWidth: number;
  showHorizontal: boolean;
  showVertical: boolean;
  sliderSafeSpacing: number;
  sliderSafePadding: number;
  outerRef: RefObject<HTMLDivElement>;
}

export const getHorizontalValues = ({
  scrollLeft,
  outerWidth,
  innerWidth,
  showHorizontal,
  showVertical,
  sliderSafeSpacing,
  sliderSafePadding,
  outerRef,
}: GetHorizontalValues) => {
  // Borders mess with scroll values
  let borderOffset = 0;

  if (outerRef.current) {
    try {
      borderOffset =
        Number(outerRef.current.style.borderLeftWidth.replace(/[^0-9.]/gi, '') || '0') +
        Number(outerRef.current.style.borderRightWidth.replace(/[^0-9.]/gi, '') || '0');
      // eslint-disable-next-line no-empty
    } catch (e) {}
  }

  return getStateValues({
    scroll: scrollLeft,
    outerSize: outerWidth,
    innerSize: innerWidth,
    show: showHorizontal,
    sliderSafeSpacing: showVertical ? sliderSafeSpacing : sliderSafePadding * 2,
    borderOffset,
  });
};

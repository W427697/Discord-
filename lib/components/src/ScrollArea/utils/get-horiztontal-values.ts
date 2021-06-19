import { RefObject } from 'react';
import { getHorizontalPosition } from './get-horizontal-position';
import { getStateValues } from './get-state-values';

interface GetHorizontalValues {
  scrollLeft: number;
  outerWidth: number;
  innerWidth: number;
  enableHorizontal: boolean;
  sliderPadding: number;
  sliderSize: number;
  horizontalPosition: 'top' | 'bottom';
  verticalPosition: 'left' | 'right';
  outerHeight: number;
  sliderSafePadding: number;
  enableVertical: boolean;
  outerRef: RefObject<HTMLDivElement>;
}

export const getHorizontalValues = ({
  scrollLeft,
  outerWidth,
  innerWidth,
  enableHorizontal,
  sliderPadding,
  sliderSize,
  horizontalPosition,
  verticalPosition,
  outerHeight,
  sliderSafePadding,
  enableVertical,
  outerRef,
}: GetHorizontalValues) => {
  // Borders mess with scroll values
  let borderOffset = 0;
  const sliderSafeSpacing = sliderSize + sliderPadding + sliderSafePadding * 2;

  if (outerRef.current) {
    try {
      borderOffset =
        Number(outerRef.current.style.borderLeftWidth.replace(/[^0-9.]/gi, '') || '0') +
        Number(outerRef.current.style.borderRightWidth.replace(/[^0-9.]/gi, '') || '0');
      // eslint-disable-next-line no-empty
    } catch (e) {}
  }

  return {
    ...getHorizontalPosition({
      sliderPadding,
      sliderSize,
      horizontalPosition,
      outerHeight,
      sliderSafePadding,
      sliderSafeSpacing,
      enableVertical,
      verticalPosition,
    }),
    ...getStateValues({
      scroll: scrollLeft,
      outerSize: outerWidth,
      innerSize: innerWidth,
      enabled: enableHorizontal,
      sliderSafeSpacing: enableVertical ? sliderSafeSpacing : sliderSafePadding * 2,
      borderOffset,
    }),
  };
};

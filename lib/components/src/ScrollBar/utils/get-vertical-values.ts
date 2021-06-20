import { RefObject } from 'react';
import { getStateValues } from './get-state-values';
import { getVerticalPosition } from './get-vertical-position';

interface GetVerticalValues {
  enableHorizontal: boolean;
  enableVertical: boolean;
  horizontalPosition: 'top' | 'bottom';
  innerHeight: number;
  outerHeight: number;
  outerRef: RefObject<HTMLDivElement>;
  outerWidth: number;
  scrollTop: number;
  sliderPadding: number;
  sliderSafePadding: number;
  sliderSize: number;
  verticalPosition: 'left' | 'right';
}

export const getVerticalValues = ({
  scrollTop,
  outerHeight,
  innerHeight,
  enableVertical,
  outerRef,
  sliderPadding,
  sliderSize,
  horizontalPosition,
  outerWidth,
  sliderSafePadding,
  enableHorizontal,
  verticalPosition,
}: GetVerticalValues) => {
  // Borders mess with scroll values
  let borderOffset = 0;
  const sliderSafeSpacing = sliderSize + sliderPadding + sliderSafePadding * 2;

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

  return {
    ...getVerticalPosition({
      sliderPadding,
      sliderSize,
      horizontalPosition,
      outerWidth,
      sliderSafePadding,
      sliderSafeSpacing,
      enableHorizontal,
      verticalPosition,
    }),
    ...getStateValues({
      scroll: scrollTop,
      outerSize: outerHeight,
      innerSize: innerHeight,
      enabled: enableVertical,
      sliderSafeSpacing: enableHorizontal ? sliderSafeSpacing : sliderSafePadding * 2,
      borderOffset,
    }),
  };
};

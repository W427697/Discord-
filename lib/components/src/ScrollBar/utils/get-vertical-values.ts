import { RefObject } from 'react';
import { getStateValues } from './get-state-values';
import { getVerticalPosition } from './get-vertical-position';

interface GetVerticalValues {
  enableHorizontal: boolean;
  enableVertical: boolean;
  horizontalPosition: 'top' | 'bottom';
  innerHeight: number;
  outerHeight: number;
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
  sliderPadding,
  sliderSize,
  horizontalPosition,
  outerWidth,
  sliderSafePadding,
  enableHorizontal,
  verticalPosition,
}: GetVerticalValues) => {
  const sliderSafeSpacing = sliderSize + sliderPadding + sliderSafePadding * 2;

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
    }),
  };
};

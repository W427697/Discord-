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
}: GetHorizontalValues) => {
  const sliderSafeSpacing = sliderSize + sliderPadding + sliderSafePadding * 2;

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
    }),
  };
};

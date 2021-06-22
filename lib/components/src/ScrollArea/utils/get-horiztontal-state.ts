import { SLIDER_SAFE_PADDING } from '../const';
import { HorizontalPositionType, VerticalPositionType } from '../types';
import { getHorizontalTrackPosition } from './get-horizontal-track-position';
import { getStateValues } from './get-state-values';

interface GetHorizontalStateProps {
  enableHorizontal: boolean;
  enableVertical: boolean;
  horizontalPosition: HorizontalPositionType;
  innerRect: DOMRect;
  outerRect: DOMRect;
  scrollLeft: number;
  sliderPadding: number;
  sliderSize: number;
  verticalPosition: VerticalPositionType;
}

export const getHorizontalState = ({
  enableHorizontal,
  enableVertical,
  horizontalPosition,
  innerRect,
  outerRect,
  scrollLeft,
  sliderPadding,
  sliderSize,
  verticalPosition,
}: GetHorizontalStateProps) => {
  const sliderSafeSpacing = sliderSize + sliderPadding + SLIDER_SAFE_PADDING * 2;

  return {
    ...getStateValues({
      enabled: enableHorizontal,
      innerSize: innerRect.width,
      outerSize: outerRect.width,
      scroll: scrollLeft,
      sliderSafeSpacing: enableVertical ? sliderSafeSpacing : SLIDER_SAFE_PADDING * 2,
    }),
    track: getHorizontalTrackPosition({
      enableVertical,
      horizontalPosition,
      outerRect,
      sliderPadding,
      sliderSafeSpacing,
      sliderSize,
      verticalPosition,
    }),
  };
};

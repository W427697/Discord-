import { SLIDER_SAFE_PADDING } from '../const';
import { HorizontalPositionType, VerticalPositionType } from '../types';
import { getStateValues } from './get-state-values';
import { getVerticalTrackPosition } from './get-vertical-track-position';

interface GetVerticalStateProps {
  enableHorizontal: boolean;
  enableVertical: boolean;
  horizontalPosition: HorizontalPositionType;
  innerRect: DOMRect;
  outerRect: DOMRect;
  scrollTop: number;
  sliderPadding: number;
  sliderSize: number;
  verticalPosition: VerticalPositionType;
}

export const getVerticalState = ({
  enableHorizontal,
  enableVertical,
  horizontalPosition,
  innerRect,
  outerRect,
  scrollTop,
  sliderPadding,
  sliderSize,
  verticalPosition,
}: GetVerticalStateProps) => {
  const sliderSafeSpacing = sliderSize + sliderPadding + SLIDER_SAFE_PADDING * 2;

  return {
    ...getStateValues({
      enabled: enableVertical,
      innerSize: innerRect.height,
      outerSize: outerRect.height,
      scroll: scrollTop,
      sliderSafeSpacing: enableHorizontal ? sliderSafeSpacing : SLIDER_SAFE_PADDING * 2,
    }),
    track: getVerticalTrackPosition({
      enableHorizontal,
      horizontalPosition,
      outerRect,
      sliderPadding,
      sliderSafeSpacing,
      sliderSize,
      verticalPosition,
    }),
  };
};

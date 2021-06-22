import { SLIDER_SAFE_PADDING } from '../const';
import { HorizontalPositionType, ScrollAreaStateItemTrack, VerticalPositionType } from '../types';

interface GetVerticalTrackPositionProps {
  enableHorizontal: boolean;
  horizontalPosition: HorizontalPositionType;
  outerRect: DOMRect;
  sliderPadding: number;
  sliderSafeSpacing: number;
  sliderSize: number;
  verticalPosition: VerticalPositionType;
}

export const getVerticalTrackPosition = ({
  enableHorizontal,
  horizontalPosition,
  outerRect,
  sliderPadding,
  sliderSafeSpacing,
  sliderSize,
  verticalPosition,
}: GetVerticalTrackPositionProps): ScrollAreaStateItemTrack => {
  // Calculate the values to get the tracks into the right position for the scroll container
  const delta = sliderPadding * 2 + sliderSize;

  const left = verticalPosition === 'left' ? 0 : outerRect.width - delta;
  let top = SLIDER_SAFE_PADDING;

  const size = outerRect.height - sliderSafeSpacing;

  if (enableHorizontal && horizontalPosition === 'top') {
    top = sliderSafeSpacing - SLIDER_SAFE_PADDING;
  }

  return { top, left, size };
};

import { SLIDER_SAFE_PADDING } from '../const';
import { HorizontalPositionType, ScrollAreaStateItemTrack, VerticalPositionType } from '../types';

interface GetHorizontalTrackPositionProps {
  enableVertical: boolean;
  horizontalPosition: HorizontalPositionType;
  outerRect: DOMRect;
  sliderPadding: number;
  sliderSafeSpacing: number;
  sliderSize: number;
  verticalPosition: VerticalPositionType;
}

export const getHorizontalTrackPosition = ({
  enableVertical,
  horizontalPosition,
  outerRect,
  sliderPadding,
  sliderSafeSpacing,
  sliderSize,
  verticalPosition,
}: GetHorizontalTrackPositionProps): ScrollAreaStateItemTrack => {
  // Calculate the values to get the tracks into the right position for the scroll container
  const delta = sliderPadding * 2 + sliderSize;

  const top = horizontalPosition === 'top' ? 0 : outerRect.height - delta;
  let left = SLIDER_SAFE_PADDING;

  const size = outerRect.width - sliderSafeSpacing;

  if (enableVertical && verticalPosition === 'left') {
    left = sliderSafeSpacing - SLIDER_SAFE_PADDING;
  }

  return { top, left, size };
};

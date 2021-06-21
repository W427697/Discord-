interface GetHorizontalPosition {
  sliderPadding: number;
  sliderSize: number;
  horizontalPosition: 'top' | 'bottom';
  verticalPosition: 'left' | 'right';
  outerHeight: number;
  sliderSafePadding: number;
  sliderSafeSpacing: number;
  enableVertical: boolean;
}

export const getHorizontalPosition = ({
  sliderPadding,
  sliderSize,
  horizontalPosition,
  outerHeight,
  sliderSafePadding,
  sliderSafeSpacing,
  enableVertical,
  verticalPosition,
}: GetHorizontalPosition) => {
  // Calculate the values to get the tracks into the right position for the scroll container
  const delta = sliderPadding * 2 + sliderSize;

  const trackTop = horizontalPosition === 'top' ? 0 : outerHeight - delta;
  let trackLeft = sliderSafePadding;

  if (enableVertical && verticalPosition === 'left') {
    trackLeft = sliderSafeSpacing - sliderSafePadding;
  }

  return { trackTop, trackLeft };
};

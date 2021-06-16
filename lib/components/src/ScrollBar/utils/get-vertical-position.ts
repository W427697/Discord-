interface GetVerticalPosition {
  sliderPadding: number;
  sliderSize: number;
  horizontalPosition: 'top' | 'bottom';
  verticalPosition: 'left' | 'right';
  outerWidth: number;
  sliderSafePadding: number;
  sliderSafeSpacing: number;
  enableHorizontal: boolean;
}

export const getVerticalPosition = ({
  sliderPadding,
  sliderSize,
  horizontalPosition,
  outerWidth,
  sliderSafePadding,
  sliderSafeSpacing,
  enableHorizontal,
  verticalPosition,
}: GetVerticalPosition) => {
  // Calculate the values to get the tracks into the right position for the scroll container
  const delta = sliderPadding * 2 + sliderSize;

  const trackLeft = verticalPosition === 'left' ? 0 : outerWidth - delta;
  let trackTop = sliderSafePadding;

  if (enableHorizontal && horizontalPosition === 'top') {
    trackTop = sliderSafeSpacing - sliderSafePadding;
  }

  return { trackTop, trackLeft };
};

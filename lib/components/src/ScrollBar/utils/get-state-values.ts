const getRatio = (inner: number, outer: number) => {
  let ratio = 0;

  if (outer === 0) {
    return ratio;
  }

  ratio = outer / inner;

  return ratio;
};

type GetStateValuesProps = {
  innerSize: number;
  outerSize: number;
  scroll: number;
  show: boolean;
  sliderSafeSpacing: number;
  borderOffset: number;
};

type GetStateValuesResult = {
  sliderPosition: number;
  sliderSize: number;
  trackSize: number;
  show: boolean;
};

export const getStateValues = ({
  innerSize,
  outerSize,
  scroll,
  show,
  sliderSafeSpacing,
  borderOffset,
}: GetStateValuesProps) => {
  let stateValues: GetStateValuesResult = {
    sliderSize: 0,
    trackSize: 0,
    sliderPosition: 0,
    show: false,
  };

  if (innerSize <= outerSize || !show) {
    return stateValues;
  }

  const outerSafe = outerSize - borderOffset;

  const containerRatio = getRatio(innerSize, outerSize);
  const trackSize = outerSize - sliderSafeSpacing;
  const sliderSize = containerRatio * trackSize;
  const scrollRatio = getRatio(innerSize - outerSafe, scroll);
  const availableSlideSpace = trackSize - sliderSize;
  const sliderPosition = scrollRatio * availableSlideSpace;

  stateValues = { ...stateValues, trackSize, sliderSize, sliderPosition, show };

  return stateValues;
};

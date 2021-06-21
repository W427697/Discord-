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
  enabled: boolean;
  sliderSafeSpacing: number;
};

type GetStateValuesResult = {
  sliderPosition: number;
  sliderSize: number;
  trackSize: number;
  enabled: boolean;
};

export const getStateValues = ({
  innerSize,
  outerSize,
  scroll,
  enabled,
  sliderSafeSpacing,
}: GetStateValuesProps) => {
  let stateValues: GetStateValuesResult = {
    sliderSize: 0,
    trackSize: 0,
    sliderPosition: 0,
    enabled: false,
  };

  if (innerSize <= outerSize || !enabled) {
    return stateValues;
  }

  const containerRatio = getRatio(innerSize, outerSize);
  const trackSize = outerSize - sliderSafeSpacing;
  const sliderSize = containerRatio * trackSize;
  const scrollRatio = getRatio(innerSize - outerSize, scroll);
  const availableSlideSpace = trackSize - sliderSize;
  const sliderPosition = scrollRatio * availableSlideSpace;

  stateValues = { ...stateValues, trackSize, sliderSize, sliderPosition, enabled };

  return stateValues;
};

interface GetPositionProps {
  outerSize: number;
  innerSize: number;
  scroll: number;
}

export const getPosition = ({ outerSize, innerSize, scroll }: GetPositionProps) => {
  let position = 0;

  if (outerSize >= innerSize) {
    return position;
  }

  const maxScrollSize = innerSize - outerSize;
  const scrollDelta = scroll / maxScrollSize;
  const availableSlideSize = (1 - outerSize / innerSize) * outerSize;

  position = availableSlideSize * scrollDelta;

  return position;
};

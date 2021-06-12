type GetSizeProps = {
  outerSize: number;
  innerSize: number;
};

export const getSize = ({ outerSize, innerSize }: GetSizeProps) => {
  const delta = outerSize === 0 ? 100 : outerSize / innerSize;
  const pixels = outerSize * delta;
  return pixels;
};

import { getPosition } from './get-position';
import { getSize } from './get-size';

type GetStateValuesProps = {
  scroll: number;
  outerSize: number;
  innerSize: number;
  show: boolean;
};

type GetStateValuesResult = {
  size: number;
  position: number;
  show: boolean;
};

export const getStateValues = ({ scroll, outerSize, innerSize, show }: GetStateValuesProps) => {
  let stateValues: GetStateValuesResult = { size: 0, position: 0, show: false };

  if (innerSize < outerSize || !show) {
    return stateValues;
  }

  const size = getSize({ outerSize, innerSize });
  const position = getPosition({ scroll, outerSize, innerSize });

  stateValues = { ...stateValues, size, position, show };

  return stateValues;
};

import A, { B, C, D, E, F, G, H } from './dummy';

const X = () => [A, B, C, D, E, F, G, H];

export const webpack = async () => {
  return X;
};

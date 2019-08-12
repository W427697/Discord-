import inner from 'somewhere';

const used = () => inner();

export const webpack = (base, config) => {
  return used();
};

import used, { alsoUsed } from 'somewhere';

export const webpack = (base, config) => {
  return used(alsoUsed());
};

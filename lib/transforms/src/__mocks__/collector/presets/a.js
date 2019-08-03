export const presets = ['./b'];

const used = 'foo';
const unused = 'bar';

export const webpack = (base, config) => {
  // preset a
  console.log(used);
};

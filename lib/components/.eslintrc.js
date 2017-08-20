const error = 2;
const ignore = 0;

module.exports = {
  extends: ['plugin:flowtype/recommended'],
  plugins: ['flowtype', 'flowtype-errors'],
  rules: {
    'flowtype-errors/show-errors': error,
    'react/prop-types': ignore,
  },
};

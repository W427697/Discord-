/* eslint-disable prefer-object-spread */
const React = require('react');

module.exports = {
  renderStory(Story, args = {}) {
    return React.createElement(Story, Object.assign({}, Story.args, args));
  },
};

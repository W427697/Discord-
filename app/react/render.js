const React = require('react');

module.exports = {
  renderStory(Story) {
    return React.createElement(Story, Story.args);
  },
};

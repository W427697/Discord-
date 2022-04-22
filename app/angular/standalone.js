const build = require('@storybook/core-server/standalone');

async function buildStandalone(options) {
  return build(options);
}

module.exports = buildStandalone;

import getStorySource from './get-storysource';

function injectDecorator(source, resourcePath, options) {
  const result = getStorySource(source, resourcePath, options);
  if (!result.changed) {
    return source;
  }

  const sourceJson = JSON.stringify(result.storySource)
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');

  const addsMap = JSON.stringify(result.addsMap);

  return `
var withStorySource = require('@storybook/addon-storysource').withStorySource;
if (window['__STORYBOOK_CLIENT_API__']) {
  window['__STORYBOOK_CLIENT_API__'].addDecorator(withStorySource(${sourceJson}, ${addsMap}));
}

${source}`;
}

export default injectDecorator;

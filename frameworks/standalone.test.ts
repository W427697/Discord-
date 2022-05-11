import build from '@storybook/core-server/standalone';

jest.mock('@storybook/core-server/standalone');

describe.each([
  ['angular'],
  ['ember'],
  ['html-webpack4'],
  ['preact-webpack4'],
  ['react-webpack4'],
  ['server-webpack4'],
  ['svelte-webpack4'],
  ['vue-webpack4'],
  ['vue3-webpack4'],
  ['web-components-webpack4'],
])('%s', (app) => {
  it('should run standalone', async () => {
    // eslint-disable-next-line import/no-dynamic-require, global-require
    const storybook = require(`@storybook/${app}/standalone`);

    await storybook({
      mode: 'static',
      outputDir: '',
    });

    expect(build).toHaveBeenCalled();
  });
});

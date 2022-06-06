import build from '@storybook/core-server/standalone';

jest.mock('@storybook/core-server/standalone');

describe.each([
  ['angular'],
  ['ember'],
  ['html-webpack5'],
  ['preact-webpack5'],
  ['react-webpack5'],
  ['server-webpack5'],
  ['svelte-webpack5'],
  ['vue-webpack5'],
  ['vue3-webpack5'],
  ['web-components-webpack5'],
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

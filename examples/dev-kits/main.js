module.exports = {
  addons: [
    '@storybook/addon-roundtrip/register',
    '@storybook/addon-parameter/register',
    '@storybook/addon-preview-wrapper/register',
  ],
  stories: ['./stories/**/*.js'],
  refs: {
    inception: 'https://storybookjs-next.now.sh/dev-kits/iframe.html',
  },
};

module.exports = {
  stories: [`${__dirname}/stories/*.*`],
  addons: [
    '@storybook/addon-roundtrip/register',
    '@storybook/addon-parameter/register',
    '@storybook/addon-preview-wrapper/register',
  ],
  refs: {
    inception: 'https://storybookjs-next.now.sh/dev-kits/iframe.html',
  },
};

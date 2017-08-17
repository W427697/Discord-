const React = require('react');
const addons = require('@storybook/addons').default;

addons.setPreview(() => React.createElement('div'));

require('@storybook/addon-knobs/register');
require('storybook-usage/register');
require('@storybook/addon-rn-pair/register');
// import 'react-storybook-addon-docgen/dist/register';

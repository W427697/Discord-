import React from 'react';
import { ReactComponent as Logo } from './storybook-logo.svg';

export default {
  title: 'Core|Webpack',
};

export const svg = () => <Logo />;
svg.title = 'SVG Loader';

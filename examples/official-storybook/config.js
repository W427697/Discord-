import React from 'react';
import ThemeProvider from '@emotion/provider';
import { storiesOf, configure, addDecorator } from '@storybook/react';
import { themes } from '@storybook/components';
import { withOptions } from '@storybook/addon-options';
import { configureViewport, INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import { withCssResources } from '@storybook/addon-cssresources';
import { withNotes } from '@storybook/addon-notes';

import 'react-chromatic/storybook-addon';
import addHeadWarning from './head-warning';
import extraViewports from './extra-viewports.json';

if (process.env.NODE_ENV === 'development') {
  if (!process.env.DOTENV_DEVELOPMENT_DISPLAY_WARNING) {
    addHeadWarning('Dotenv development file not loaded');
  }

  if (!process.env.STORYBOOK_DISPLAY_WARNING) {
    addHeadWarning('Global storybook env var not loaded');
  }

  if (process.env.DISPLAY_WARNING) {
    addHeadWarning('Global non-storybook env var loaded');
  }
}

addHeadWarning('Preview head not loaded', 'preview-head-not-loaded');
addHeadWarning('Dotenv file not loaded', 'dotenv-file-not-loaded');

addDecorator(
  withOptions({
    hierarchySeparator: /\/|\./,
    hierarchyRootSeparator: /\|/,
    theme: themes.dark,
  })
);

addDecorator(
  withCssResources({
    cssresources: [
      {
        name: `bluetheme`,
        code: `<style>body {
  background-color: lightblue;
}</style>`,
        picked: false,
      },
    ],
  })
);

addDecorator(
  (story, { kind }) =>
    kind === 'Core|Errors' ? (
      story()
    ) : (
      <ThemeProvider theme={themes.normal}>{story()}</ThemeProvider>
    )
);

addDecorator(withNotes);

configureViewport({
  viewports: {
    ...INITIAL_VIEWPORTS,
    ...extraViewports,
  },
});

function importAll(req) {
  req.keys().forEach(filename => req(filename));
}

// The simplest version of examples would just export this function for users to use
function importAllExamples(req) {
  req.keys().forEach(filename => {
    const { default: component, ...examples } = req(filename);

    let componentOptions = component;
    if (component.prototype && component.prototype.isReactComponent) {
      componentOptions = { component };
    }

    // TODO: how to pass module?
    const kind = storiesOf(componentOptions.title || componentOptions.component.displayName);

    (componentOptions.decorators || []).forEach(decorator => {
      kind.addDecorator(decorator);
    });
    if (componentOptions.parameters) {
      kind.addParameters(componentOptions.parameters);
    }

    Object.keys(examples).forEach(key => {
      const example = examples[key];
      const { title = key, parameters } = example;
      kind.add(title, example, parameters);
    });
  });
}

function loadStories() {
  let req;
  req = require.context('../../lib/ui/src', true, /\.stories\.js$/);
  importAll(req);

  req = require.context('../../lib/components/src', true, /\.stories\.js$/);
  importAll(req);

  req = require.context('./stories', true, /\.stories\.js$/);
  importAll(req);

  req = require.context('./stories', true, /\.examples\.js$/);
  importAllExamples(req);
}

configure(loadStories, module);

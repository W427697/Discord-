// ESLINT AND TSIGNORE ADDED JUST TO NOT HAVE ERRORS WHILE READING THE PROPOSAL

/* eslint-disable */
// FROM
// Given a test file where the user would basically only import a story and render it using react testing library
/* @ts-ignore */
import React from 'react';
/* @ts-ignore */
import { render } from '@testing-library/react';

/* @ts-ignore */
import { Primary } from './Button.stories';

test('renders button', () => {
  const { getByText } = render(<Primary>Hello world</Primary>);
  const buttonElement = getByText(/Hello world/i);
  expect(buttonElement).not.toBeNull();
});

// given that they install a babel plugin like
const plugins = [
  {
    name: '@storybook/csf-utils',
    options: {
      configPath: './storybook', // will be used to figure out preview path
    },
  },
];

// TO
// I want to be able to transform such code in
/**
 * 1 - Find imports for stories and prepend default export Meta:
 *
 * input: import { Primary } from './Button.stories';
 * output: import Meta, { Primary } from './Button.stories';
 *
 *
 * 2 - Find the preview.js path and add an import for it:
 *
 * output: import * as globalConfig from '../../.storybook/preview';
 *
 *
 * 3 - Find where <Primary> is used and convert it to a decorated component
 * input:
 * const { getByText } = render(<PrimaryButton>Hello world</PrimaryButton>);
 *
 * output:
 * const PrimaryComponent = decorateStory(Meta, Primary, globalConfig);
 * const { getByText } = render(<PrimaryComponent>Hello world</PrimaryComponent>);
 */
/* @ts-ignore */
import React from 'react';
/* @ts-ignore */
import { render } from '@testing-library/react';
import { decorateStory } from '@storybook/react';

/* @ts-ignore */
import Meta, { Primary } from './Button.stories';
import * as globalConfig from '../../.storybook/preview';

test('renders button', () => {
  const PrimaryComponent = decorateStory(Meta, Primary, globalConfig);
  const { getByText } = render(<PrimaryComponent>Hello world</PrimaryComponent>);
  const buttonElement = getByText(/Hello world/i);
  expect(buttonElement).not.toBeNull();
});

// Babel plugin skeleton
export default function (babel: any) {
  const { types: t } = babel;

  return {
    name: '@storybook/csf-utils',
    visitor: {
      ImportDeclaration: function (path: any, state: any) {
        var source = path.node.source.value;

        var memberImports = path.node.specifiers.filter(function (specifier: any) {
          return specifier.type === 'ImportDeclaration';
        });
        memberImports.forEach(function (memberImport: any) {
          // Examples of member imports:
          //      import { Basic } from './Button'; (ImportSpecifier)
          //      import { Basic as BasicButton } from './Button' (ImportSpecifier)
          // transform this:
          //      import { Basic as BasicButton } from './Button';
          // into this:
          //      import Meta, { Basic as BasicButton } from './Button';
        });
      },
      Identifier(path: any) {
        // Transform
        // const { getByText } = render(<Primary>Hello world</Primary>);
        // Into
        // const PrimaryComponent = decorateStory(Meta, Primary, globalConfig);
        // const { getByText } = render(<PrimaryComponent>Hello world</PrimaryComponent>);
      },
    },
  };
}

/* eslint-disable prefer-destructuring,@typescript-eslint/ban-types */
import { once } from '@storybook/client-logger';
import { instrument } from '@storybook/instrumenter';
import * as domTestingLibrary from '@testing-library/dom';
import _userEvent from '@testing-library/user-event';
import dedent from 'ts-dedent';
import type { FireFunction, FireObject } from '@testing-library/dom/types/events';
import type { BoundFunctions } from '@testing-library/dom';
import type { Promisify, PromisifyObject } from './utils';

type TestingLibraryDom = typeof domTestingLibrary;

const testingLibrary = instrument(
  { ...domTestingLibrary },
  {
    intercept: (method, path) =>
      path[0] === 'fireEvent' ||
      method.startsWith('find') ||
      method.startsWith('waitFor') ||
      method.startsWith('query') ||
      method.startsWith('get'),
  }
) as {} as PromisifyObject<Omit<TestingLibraryDom, 'fireEvent' | 'within'>> & {
  fireEvent: Promisify<FireFunction> & PromisifyObject<FireObject>;
  within: (
    element: HTMLElement
  ) => PromisifyObject<BoundFunctions<typeof domTestingLibrary.queries>>;
};

testingLibrary.screen = new Proxy(testingLibrary.screen, {
  get(target, prop, receiver) {
    once.warn(dedent`
          You are using Testing Library's \`screen\` object. Use \`within(canvasElement)\` instead.
          More info: https://storybook.js.org/docs/react/essentials/interactions
        `);
    return Reflect.get(target, prop, receiver);
  },
});

export const {
  buildQueries,
  configure,
  createEvent,
  fireEvent,
  findAllByAltText,
  findAllByDisplayValue,
  findAllByLabelText,
  findAllByPlaceholderText,
  findAllByRole,
  findAllByTestId,
  findAllByText,
  findAllByTitle,
  findByAltText,
  findByDisplayValue,
  findByLabelText,
  findByPlaceholderText,
  findByRole,
  findByTestId,
  findByText,
  findByTitle,
  getAllByAltText,
  getAllByDisplayValue,
  getAllByLabelText,
  getAllByPlaceholderText,
  getAllByRole,
  getAllByTestId,
  getAllByText,
  getAllByTitle,
  getByAltText,
  getByDisplayValue,
  getByLabelText,
  getByPlaceholderText,
  getByRole,
  getByTestId,
  getByText,
  getByTitle,
  getConfig,
  getDefaultNormalizer,
  getElementError,
  getNodeText,
  getQueriesForElement,
  getRoles,
  getSuggestedQuery,
  isInaccessible,
  logDOM,
  logRoles,
  prettyDOM,
  queries,
  queryAllByAltText,
  queryAllByAttribute,
  queryAllByDisplayValue,
  queryAllByLabelText,
  queryAllByPlaceholderText,
  queryAllByRole,
  queryAllByTestId,
  queryAllByText,
  queryAllByTitle,
  queryByAltText,
  queryByAttribute,
  queryByDisplayValue,
  queryByLabelText,
  queryByPlaceholderText,
  queryByRole,
  queryByTestId,
  queryByText,
  queryByTitle,
  queryHelpers,
  waitFor,
  waitForElementToBeRemoved,
  within,
  prettyFormat,
} = testingLibrary;

export const screen = testingLibrary.screen;

export const { userEvent } = instrument({ userEvent: _userEvent }, { intercept: true });

/* eslint-disable no-underscore-dangle */
import type { LoaderFunction } from '@storybook/types';
import { global } from '@storybook/global';
import type { onMockCalled as onMockCalledType } from '@storybook/test';
import { action } from './runtime';

let subscribed = false;

const logActionsWhenMockCalled: LoaderFunction = (context) => {
  const {
    parameters: { actions },
  } = context;
  if (actions?.disable) return;

  if (
    !subscribed &&
    '__STORYBOOK_TEST_ON_MOCK_CALLED__' in global &&
    typeof global.__STORYBOOK_TEST_ON_MOCK_CALLED__ === 'function'
  ) {
    const onMockCalled = global.__STORYBOOK_TEST_ON_MOCK_CALLED__ as typeof onMockCalledType;
    onMockCalled((mock, args) => action(mock.getMockName())(args));
    subscribed = true;
  }
};

export const loaders: LoaderFunction[] = [logActionsWhenMockCalled];

/* eslint-disable no-underscore-dangle */
import type { LoaderFunction } from '@storybook/types';
import { global } from '@storybook/global';
import type { onMockCall as onMockCallType } from '@storybook/test';
import { action } from './runtime';

let subscribed = false;

const logActionsWhenMockCalled: LoaderFunction = (context) => {
  const {
    parameters: { actions },
  } = context;
  if (actions?.disable) return;

  if (
    !subscribed &&
    '__STORYBOOK_TEST_ON_MOCK_CALL__' in global &&
    typeof global.__STORYBOOK_TEST_ON_MOCK_CALL__ === 'function'
  ) {
    const onMockCall = global.__STORYBOOK_TEST_ON_MOCK_CALL__ as typeof onMockCallType;
    onMockCall((mock, args) => {
      const name = mock.getMockName();

      // TODO: Make this a configurable API in 8.2
      if (
        !/^next\/.*::/.test(name) ||
        name.startsWith('next/router::useRouter()') ||
        name.startsWith('next/navigation::useRouter()') ||
        ((name.startsWith('next/headers::cookies()') ||
          name.startsWith('next/headers::headers()')) &&
          (name.endsWith('set') || name.endsWith('delete')))
      ) {
        action(name)(args);
      }
    });
    subscribed = true;
  }
};

export const loaders: LoaderFunction[] = [logActionsWhenMockCalled];

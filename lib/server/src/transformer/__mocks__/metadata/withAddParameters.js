/* eslint-disable import/no-extraneous-dependencies */
import { addParameters, addDecorator } from '@storybook/react';

addDecorator(fn => fn());
addParameters({
  foo: 4,
});

import { configure } from '@storybook/react';

configure(
  [require.context('./stories', true, /\.js$/), require.context('./stories', true, /\.tsx$/)],
  module
);

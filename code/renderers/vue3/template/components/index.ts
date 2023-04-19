/* eslint-disable no-param-reassign */
import { global as globalThis } from '@storybook/global';

import Button from './Button.vue';
import Pre from './Pre.vue';
import Form from './Form.vue';
import Html from './Html.vue';

const setGlobal = (global: any) => {
  global.Components = { Button, Pre, Form, Html };
  global.storybookRenderer = 'vue3';
};

setGlobal(globalThis);

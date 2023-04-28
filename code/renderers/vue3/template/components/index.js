import { global as globalThis } from '@junk-temporary-prototypes/global';

import Button from './Button.vue';
import Pre from './Pre.vue';
import Form from './Form.vue';
import Html from './Html.vue';

globalThis.Components = { Button, Pre, Form, Html };
globalThis.storybookRenderer = 'vue3';

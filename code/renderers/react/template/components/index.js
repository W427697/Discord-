import globalThis from 'global';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render } from '@storybook/react/preview';

import { Button } from './Button.jsx';
import { Code } from './Code.jsx';

globalThis.Components = { Button, Code, render };

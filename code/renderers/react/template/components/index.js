import globalThis from 'global';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render } from '@storybook/react/preview';

import { Button } from './Button.jsx';
import { Pre } from './Pre.jsx';
import { styleDecorator } from './styleDecorator.jsx';

globalThis.Components = { Button, Pre, styleDecorator, render };

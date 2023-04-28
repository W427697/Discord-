import { global as globalThis } from '@junk-temporary-prototypes/global';

import { Button } from './Button';
import { Pre } from './Pre';
import { Form } from './Form';
import { Html } from './Html';

globalThis.Components = { Button, Pre, Form, Html };
globalThis.storybookRenderer = 'html';

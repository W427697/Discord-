import React from 'react';
import { Button } from './button';

export default { component: Button, title: 'Examples / Button' };

export const WithArgs = (args: Args) => <Button {...args} />;
WithArgs.args = { label: 'With args' };

export const Basic = () => <Button label="Click me" />;

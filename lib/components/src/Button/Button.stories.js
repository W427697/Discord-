import React from 'react';
import { storiesOf } from '@storybook/react';
import { Button } from './Button';

export default { title: 'Button', component: Button };

export const button = () => <Button label="button" />;

export const link = () => <Button isLink label="link" />;

// console.log({ docgen: Button.__docgenInfo })

// storiesOf('Button', module)
//   .addParameters({ component: Button })
//   .add('button', () => <Button label={'button'} />)
//  .add('link', () => <Button isLink label={'link'} />)

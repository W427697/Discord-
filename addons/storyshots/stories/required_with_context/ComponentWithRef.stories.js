import React from 'react';
import { storiesOf, action } from '@storybook/react';
import ComponentWithRef from './ComponentWithRef';

storiesOf('Component with ref', module).add('on mount', () => (
  <ComponentWithRef onLoad={action('component mount')} />
));

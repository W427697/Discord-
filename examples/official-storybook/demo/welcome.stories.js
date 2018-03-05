import React from 'react';
import { Welcome } from '@storybook/react/demo';
import { storiesOf } from '@storybook/react';

storiesOf('Other|Demos/Welcome', module).add('to Storybook', () => <Welcome showKind="Button" />);

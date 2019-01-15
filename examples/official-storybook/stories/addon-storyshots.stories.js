import React from 'react';
import { storiesOf } from '@storybook/react';

storiesOf('Addons|Storyshots/base', module)
  .add('text', () => <div>This is a test</div>)
  .add('table', () => (
    <table>
      <thead>
        <tr>
          <th>name</th>
          <th>type</th>
          <th>default</th>
          <th>description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>MyName</td>
          <td>MyType</td>
          <td>MyDefault</td>
          <td>MyDesc</td>
        </tr>
      </tbody>
    </table>
  ));

storiesOf('Addons|Storyshots/no decorators', module)
  .addParameters({ storyshots: { shallow: true } })
  .addDecorator(fn => <div id="1">{fn()}</div>)
  .addDecorator(fn => <div id="2">{fn()}</div>)
  .addDecorator(fn => <div id="3">{fn()}</div>)
  .add('do not snapshot decorators', () => (
    <div>do not snapshot decorators, this story should have only 1 div wrapping it</div>
  ));

storiesOf('Addons|Storyshots/with decorators', module)
  .addParameters({ storyshots: { shallow: false } })
  .addDecorator(fn => <div id="1">{fn()}</div>)
  .addDecorator(fn => <div id="2">{fn()}</div>)
  .addDecorator(fn => <div id="3">{fn()}</div>)
  .add('do not snapshot decorators', () => (
    <div>do not snapshot decorators, this story should have only 1 div wrapping it</div>
  ));

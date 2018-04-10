// @flow
import React, { Component } from 'react';
import { action } from '@storybook/addon-actions';

import Checkbox from './Checkbox';

export default class App extends Component<{}, { checked: boolean }> {
  state = {
    checked: false,
  };
  render() {
    const { checked } = this.state;
    const onChange: () => void = () => {
      action('Checkbox checked')('checked', checked);
      this.setState({ checked: !checked });
    };
    return <Checkbox id="default" label="Label" checked={checked} onChange={onChange} />;
  }
}

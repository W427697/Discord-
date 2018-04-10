// @flow
import React, { Component } from 'react';

import { action } from '@storybook/addon-actions';

import Radio from './Radio';

class App extends Component<{}, { value: string }> {
  state = {
    value: '',
  };

  onChange: Event => void = (e: Event) => {
    action('Radio onChange')(e.target.value);
    this.setState({ value: e.target.value });
  };

  render() {
    return (
      <div onChange={this.onChange}>
        <Radio value="female" name="gender" id="female-radio" label="Female" />
        <Radio value="male" name="gender" id="male-radio" label="Male" />
      </div>
    );
  }
}

export default App;

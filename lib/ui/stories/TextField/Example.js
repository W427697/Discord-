// @flow
import React, { Component } from 'react';
import { action } from '@storybook/addon-actions';

import TextField from './TextField';

class Example extends Component<{}, { text: string }> {
  state = {
    text: '',
  };
  render() {
    return (
      <TextField
        value={this.state.text}
        label="Title"
        name="title"
        onChange={e => {
          this.setState({ text: e.target.value }, () => {
            action('TextField')('value', this.state.text);
          });
        }}
      />
    );
  }
}

export default Example;

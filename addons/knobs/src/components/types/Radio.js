import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { RadioList, RadioItem, RadioLabel } from '@storybook/components';

class RadioType extends Component {
  renderOptionList({ options }) {
    if (Array.isArray(options)) {
      return options.map(val => this.renderOption(val, val));
    }
    return Object.keys(options).map(key => this.renderOption(key, options[key]));
  }

  renderOption(key, value) {
    return (
      <RadioItem key={key}>
        <input type="radio" id={value} name={this.props.knob.name} value={value} />
        <RadioLabel htmlFor={value}>{key}</RadioLabel>
      </RadioItem>
    );
  }

  render() {
    const { knob, onChange } = this.props;

    return (
      <RadioList id={knob.name} value={knob.value} onChange={e => onChange(e.target.value)}>
        {this.renderOptionList(knob)}
      </RadioList>
    );
  }
}

RadioType.defaultProps = {
  knob: {},
  onChange: value => value,
};

RadioType.propTypes = {
  knob: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.string,
    options: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  }),
  onChange: PropTypes.func,
};

RadioType.serialize = value => value;
RadioType.deserialize = value => value;

export default RadioType;

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Select } from '@storybook/components';

const safeToString = value => (value.toString && value.toString()) || `${value}`;

const stringifyKeys = object =>
  Object.keys(object).reduce(
    (finalObject, key) => ({
      ...finalObject,
      [safeToString(key)]: object[key],
    }),
    {}
  );

class SelectType extends Component {
  static getDerivedStateFromProps({ knob }) {
    const optionsMap = Array.isArray(knob.options)
      ? knob.options.reduce(
          (finalObject, value) => ({
            ...finalObject,
            [safeToString(value)]: value,
          }),
          {}
        )
      : stringifyKeys(knob.options);

    return {
      optionsMap,
    };
  }

  state = {
    optionsMap: {},
  };

  handleSelect = event => {
    const { onChange } = this.props;
    const { optionsMap } = this.state;

    onChange(optionsMap[event.target.value]);
  };

  renderOptionList(options) {
    return Object.keys(options).map(key => (
      <option key={key} value={key}>
        {key}
      </option>
    ));
  }

  render() {
    const { knob } = this.props;
    const { optionsMap } = this.state;

    return (
      <Select value={knob.value} onChange={this.handleSelect} size="flex">
        {this.renderOptionList(optionsMap)}
      </Select>
    );
  }
}

SelectType.defaultProps = {
  knob: {},
  onChange: value => value,
};

SelectType.propTypes = {
  knob: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.any,
    options: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  }),
  onChange: PropTypes.func,
};

SelectType.serialize = value => value;
SelectType.deserialize = value => value;

export default SelectType;

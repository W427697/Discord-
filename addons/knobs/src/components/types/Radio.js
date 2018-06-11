import PropTypes from 'prop-types';
import React from 'react';
import styled from 'react-emotion';

const Radio = styled('fieldset')({
  display: 'table-cell',
  boxSizing: 'border-box',
  verticalAlign: 'middle',
  height: '26px',
  width: '100%',
  outline: 'none',
  border: '1px solid #f7f4f4',
  borderRadius: 2,
  fontSize: 11,
  padding: '5px',
  color: '#555',
});

class RadioType extends React.Component {
  renderOptionList({ options }) {
    if (Array.isArray(options)) {
      return options.map(val => this.renderOption(val, val));
    }
    return Object.keys(options).map(key => this.renderOption(key, options[key]));
  }

  renderOption(key, value) {
    return (
      <li key={key}>
        <input type="radio" id={value} name="select" value={value} />
        <label htmlFor={value}>{key}</label>
      </li>
    );
  }

  render() {
    const { knob, onChange } = this.props;

    return (
      <Radio id={knob.name} value={knob.value} onChange={e => onChange(e.target.value)}>
        <ul>{this.renderOptionList(knob)}</ul>
      </Radio>
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

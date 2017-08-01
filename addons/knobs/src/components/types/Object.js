import PropTypes from 'prop-types';
import React from 'react';
import AceEditor from 'react-ace';

import 'brace';
import 'brace/mode/javascript';
import 'brace/theme/github';

const getSpaces = level => Array.from({ length: level * 2 }, () => ' ').join('');

function toString(obj, spaceLevel = 1) {
  const string = [];

  if (typeof obj === 'object' && obj !== null) {
    const keys = Object.keys(obj);
    string.push('{', '\n');

    keys.forEach(prop =>
      string.push(getSpaces(spaceLevel), prop, ': ', toString(obj[prop], spaceLevel + 1), ',', '\n')
    );

    string.push(getSpaces(spaceLevel - 1), '}');
  } else if (Array.isArray(obj)) {
    const keys = Object.keys(obj);
    string.push('[');

    keys.forEach(prop => string.push(toString(obj[prop]), ','));

    string.push(']');
  } else if (typeof obj === 'function') {
    string.push(obj.toString());
  } else {
    string.push(JSON.stringify(obj));
  }

  return `${string.join('')}`;
}

class ObjectType extends React.Component {
  onRef = ref => {
    this.ace = ref;
  };

  handleChange = value => {
    const { onChange } = this.props;

    try {
      onChange(value);
    } catch (err) {
      console.warn(err);
    }
  };

  render() {
    const { knob } = this.props;
    const objectString = knob.value;

    return (
      <AceEditor
        ref={this.onRef}
        mode="javascript"
        name={knob.name}
        value={objectString}
        width="100%"
        onChange={this.handleChange}
        editorProps={{ $blockScrolling: true }}
      />
    );
  }
}

ObjectType.defaultProps = {
  knob: {},
  onChange: value => value,
};

ObjectType.propTypes = {
  knob: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.string,
  }),
  onChange: PropTypes.func,
};

ObjectType.deserialize = value => eval(`(${value})`); // eslint-disable-line no-eval
ObjectType.serialize = obj => `(${toString(obj)})`;

export default ObjectType;

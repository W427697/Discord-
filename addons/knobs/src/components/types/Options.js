import React from 'react';
import PropTypes from 'prop-types';

import RadiosType from './Radio';
import SelectType from './Select';
import BooleanType from './Boolean';

const OptionsType = props => {
  const { knob } = props;
  const { display } = knob.displayType;

  if (display === 'radio') {
    return <RadiosType {...props} />;
  }
  if (display === 'inline-radio') {
    return <RadiosType {...props} inline />;
  }
  if (display === 'check') {
    return <BooleanType name={knob.name} value={knob.value} />;
  }

  return <SelectType {...props} />;
};

OptionsType.defaultProps = {
  knob: {},
  onChange: value => value,
};

OptionsType.propTypes = {
  knob: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.string,
    options: PropTypes.object,
  }),
  onChange: PropTypes.func,
};

OptionsType.serialize = value => value;
OptionsType.deserialize = value => value;

export default OptionsType;

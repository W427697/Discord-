import React from 'react';
import PropTypes from 'prop-types';
import { storiesOf } from '@storybook/react';

import { withKnobs, select } from '@storybook/addon-knobs';

const stories = storiesOf('Type safe select knob', module);

stories.addDecorator(withKnobs);

const FizzBuzzPrinter = ({ value }) => {
  let output = '';
  if (value % 3 === 0) {
    output += 'Fizz';
  }
  if (value % 5 === 0) {
    output += 'Buzz';
  }
  if (!output.length) {
    output += value;
  }

  return <p>{output}</p>;
};

FizzBuzzPrinter.propTypes = {
  value: PropTypes.number.isRequired,
};

stories.add('index', () => (
  <React.Fragment>
    <FizzBuzzPrinter value={select('FizzBuzz array', [1, 2, 3, 5, 15], 1)} />
    <FizzBuzzPrinter
      value={select('FizzBuzz map', { one: 1, two: 2, three: 3, five: 5, fifteen: 15 }, 1)}
    />
  </React.Fragment>
));

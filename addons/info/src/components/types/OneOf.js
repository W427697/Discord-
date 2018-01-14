import React from 'react';
import { TypeInfo } from './proptypes';
import PropVal from '../PropVal';

const OneOf = ({ propType }) =>
  Array.isArray(propType.value) && (
    <span>
      {propType.value.reduce((arr, { value }, i) => {
        arr.push(<PropVal val={value} />);
        if (i !== propType.value.length - 1) {
          arr.push(' | ');
        }

        return arr;
      }, [])}
    </span>
  );

OneOf.propTypes = {
  propType: TypeInfo.isRequired,
};

export default OneOf;

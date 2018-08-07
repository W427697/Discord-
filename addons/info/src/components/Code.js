import React from 'react';
import PropTypes from 'prop-types';
import Node from './Node';
import { Pre } from './markdown';

export default function Code(props) {
  return (
    <Pre>
      {React.Children.map(props.children, (root, idx) => (
        <Node
          key={idx}
          node={root}
          depth={0}
          maxPropsIntoLine={props.maxPropsIntoLine}
          maxPropObjectKeys={props.maxPropObjectKeys}
          maxPropArrayLength={props.maxPropArrayLength}
          maxPropStringLength={props.maxPropStringLength}
        />
      ))}
    </Pre>
  );
}

Code.displayName = 'Code';

Code.propTypes = {
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  maxPropsIntoLine: PropTypes.number.isRequired,
  maxPropObjectKeys: PropTypes.number.isRequired,
  maxPropArrayLength: PropTypes.number.isRequired,
  maxPropStringLength: PropTypes.number.isRequired
};

Code.defaultProps = {
  children: null
};

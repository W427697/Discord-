import React from 'react';
import PropTypes from 'prop-types';
import PropVal from './PropVal';

const stylesheet = {
  propStyle: {
    display: 'inline',
  },
  propStyleInNewLine: {
    display: 'block',
    paddingLeft: 18,
  },
  propNameStyle: {
    display: 'inline',
  },
  propValueStyle: {
    display: 'inline',
  },
  propValueWrapperStyle: {
    display: 'inline',
  },
};

export default function Props(props) {
  const {
    singleLine,
    showSourceOfProps,
    maxPropsIntoLine,
    maxPropArrayLength,
    maxPropObjectKeys,
    maxPropStringLength,
  } = props;
  const nodeProps = props.node.props;
  const defaultProps = props.node.type.defaultProps;
  if (!nodeProps || typeof nodeProps !== 'object') {
    return <span />;
  }

  const {
    propStyle,
    propStyleInNewLine,
    propValueStyle,
    propNameStyle,
    propValueWrapperStyle
  } = stylesheet;

  const names = Object.keys(nodeProps).filter(
    name =>
      name[0] !== '_' &&
      name !== 'children' &&
      (!defaultProps || nodeProps[name] !== defaultProps[name])
  );

  const breakIntoNewLines = names.length > maxPropsIntoLine;
  const endingSpace = singleLine ? ' ' : '';

  const items = [];
  names.forEach((name, i) => {
    items.push(
      <div key={name} style={breakIntoNewLines ? propStyleInNewLine : propStyle}>
        <div style={propNameStyle}>
          {name}
        </div>
        {/* Use implicit true: */}
        {(!nodeProps[name] || typeof nodeProps[name] !== 'boolean') &&
          <div style={propValueWrapperStyle}>
            =
            <div style={propValueStyle}>
              <PropVal
                val={nodeProps[name]}
                showSourceOfProps={showSourceOfProps}
                maxPropsIntoLine={maxPropsIntoLine}
                maxPropObjectKeys={maxPropObjectKeys}
                maxPropArrayLength={maxPropArrayLength}
                maxPropStringLength={maxPropStringLength}
              />
            </div>
          </div>}

        {i === names.length - 1 && (breakIntoNewLines ? <br /> : endingSpace)}
      </div>
    );
  });

  return (
    <span>
      {items}
    </span>
  );
}

Props.defaultProps = {
  singleLine: false,
};

Props.propTypes = {
  node: PropTypes.node.isRequired,
  singleLine: PropTypes.bool,
  showSourceOfProps: PropTypes.bool.isRequired,
  maxPropsIntoLine: PropTypes.number.isRequired,
  maxPropObjectKeys: PropTypes.number.isRequired,
  maxPropArrayLength: PropTypes.number.isRequired,
  maxPropStringLength: PropTypes.number.isRequired,
};

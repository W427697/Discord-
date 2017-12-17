import React from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';

const Fallback = ({ children }) => <div>{children}</div>;
Fallback.propTypes = {
  children: PropTypes.node.isRequired,
};

const Mapper = ({ children, component, props, ...rest }, componentMap) => {
  console.log({ component, props, rest });

  const Component = componentMap[component] || Fallback;

  return <Component {...{ ...props, ...rest }}>{children}</Component>;
};
Mapper.propTypes = {
  children: PropTypes.node,
  component: PropTypes.string.isRequired,
  props: PropTypes.oneOfType([PropTypes.object]),
};
Mapper.defaultProps = {
  children: [],
  props: {},
};

const ReactComponent = dynamic({
  modules: () => {
    //  Add remove components based on props

    const components = {
      Test: import('./Test'),
      CodeSwitcher: import('./CodeSwitcher.js'),
    };

    return components;
  },
  render: Mapper,
});

ReactComponent.displayName = 'Markdown.ReactComponent';

export { ReactComponent as default };

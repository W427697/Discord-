import React from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';

const ReactComponent = glamorous(({ children, component, props, className, ...rest }) => {
  console.log(component, props, rest);
  return (
    <div className={className}>
      {children}
      <pre>{JSON.stringify({ component, props }, null, 2)}</pre>
    </div>
  );
})({
  border: '1px solid orangered',
});
ReactComponent.displayName = 'Markdown.ReactComponent';
ReactComponent.propTypes = {
  children: PropTypes.node.isRequired,
  component: PropTypes.string.isRequired,
  props: PropTypes.oneOfType([PropTypes.object]).isRequired,
};

export { ReactComponent as default };

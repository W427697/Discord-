import React from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';

const TestComponent = glamorous(({ children, className, ...props }) => (
  <div className={className}>
    <h1>Test</h1>
    <pre>{JSON.stringify({ props }, null, 2)}</pre>
    {children}
  </div>
))({
  border: '1px solid deepskyblue',
});
TestComponent.displayName = 'Markdown.Test';
TestComponent.propTypes = {
  component: PropTypes.string,
  props: PropTypes.oneOfType([PropTypes.object]),
};

export { TestComponent as default };

/* eslint-disable */
import React, { Fragment } from 'react';

const text = 'Testing the a11y addon';
const href = 'http://example.com';

export default {
  title: 'Addons/A11y/Configured',
  parameters: {
    options: { selectedPanel: 'storybook/a11y/panel' },
    a11y: {
      element: undefined,
      config: {},
      options: {},
      manual: true,
    },
  },
};

export const ManualNoOptions = () => (
  <Fragment>
    <h1>{text}</h1>
    <p>{text}</p>
    <a href={href}>{`${text}...`}</a>
  </Fragment>
);

export const AutoTargetElement = () => (
  <Fragment>
    <h1>Ignoring this</h1>
    <div className="a11yOnThis">
      <p>{text}</p>
      <a href={href}>{`${text}...`}</a>
    </div>
  </Fragment>
);

AutoTargetElement.story = {
  name: 'Auto Target Element',
  parameters: {
    a11y: {
      element: '.a11yOnThis',
      config: {},
      options: {},
      manual: false,
    },
  },
};

import React, { Component } from 'react';

import { el, forceReRender } from '.';

// This is a total hack for a basic proof-of-concept
export default class StorybookPreview extends Component {
  componentDidMount() {
    forceReRender();
  }
  render() {
    return <div id="storybook-preview" ref={el} />;
  }
}

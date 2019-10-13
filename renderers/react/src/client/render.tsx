import React, { Component, ReactNode } from 'react';
import ReactDOM from 'react-dom';
import { StoryContext } from '@storybook/addons';

class ErrorBoundary extends Component<{
  resolve: () => void;
  reject: (err: Error) => void;
}> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidMount() {
    this.resolveIfNoError();
  }

  componentDidUpdate() {
    this.resolveIfNoError();
  }

  componentDidCatch(err: Error) {
    const { reject } = this.props;
    reject(err);
  }

  resolveIfNoError() {
    const { hasError } = this.state;
    const { resolve } = this.props;
    if (!hasError) {
      resolve();
    }
  }

  render() {
    const { hasError } = this.state;
    const { children } = this.props;

    return hasError ? null : children;
  }
}

export default (element: ReactNode, container: Element, context: Partial<StoryContext>) =>
  new Promise((resolve, reject) => {
    ReactDOM.render(
      <ErrorBoundary resolve={resolve} reject={reject}>
        {element}
      </ErrorBoundary>,
      container
    );
  });

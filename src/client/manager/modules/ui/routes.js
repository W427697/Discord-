import React from 'react';
import ReactDOM from 'react-dom';
import Layout from './components/layout';
import Preview from '../preview/containers/preview';

export default function (injectDeps) {
  const InjectedLayout = injectDeps(Layout);
  const rootEl = document.getElementById('root');

  const root = (
    <InjectedLayout
      leftPanel={() => 'leftPanel'}
      preview={() => (<Preview />)}
      downPanel={() => 'downPanel'}
    />
  );
  ReactDOM.render(root, rootEl);
}

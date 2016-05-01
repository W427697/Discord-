import React from 'react';
import ReactDOM from 'react-dom';
import Layout from './components/layout';
import Preview from '../preview/containers/preview';
import LeftPanel from './containers/left_panel';

export default function (injectDeps) {
  const InjectedLayout = injectDeps(Layout);
  const rootEl = document.getElementById('root');

  const root = (
    <InjectedLayout
      leftPanel={() => (<LeftPanel />)}
      preview={() => (<Preview />)}
      downPanel={() => 'downPanel'}
    />
  );
  ReactDOM.render(root, rootEl);
}

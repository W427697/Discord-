import React from 'react';
import ReactDOM from 'react-dom';
import Layout from './containers/layout';
import Preview from '../preview/containers/preview';
import LeftPanel from './containers/left_panel';
import ActionLogger from './containers/action_logger';

export default function (injectDeps) {
  const InjectedLayout = injectDeps(Layout);
  const rootEl = document.getElementById('root');

  const root = (
    <InjectedLayout
      leftPanel={() => (<LeftPanel />)}
      preview={() => (<Preview />)}
      downPanel={() => (<ActionLogger />)}
    />
  );
  ReactDOM.render(root, rootEl);
}

// import { createApp } from 'mantra-core';
// import Podda from 'podda';

// import buildContext from './context';
// import shortcutsModule from './modules/shortcuts';
// import apiModule from './modules/api';
// import uiModule from './modules/ui';
// import { setContext, setActions } from './compose';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider as ReduxProvider } from 'react-redux';
import createAppStore from './createStore';
// import Layout from './components/layout';
// import LeftPanel from './components/left_panel';
// import DownPanel from './components/down_panel';
// import { ShortcutsHelp } from './components/shortcuts_help';
import SearchBox from './containers/SearchBox';
import { loadStories } from './actions/stories';

export class Provider {
  renderPreview() {
    throw new Error('Provider.renderPreview() is not implemented!');
  }

  handleAPI() {
    throw new Error('Provider.handleAPI() is not implemented!');
  }
}

export default function(domNode, provider) {
  if (!(provider instanceof Provider)) {
    throw new Error('provider is not extended from the base Provider');
  }

  const initialState = {
    // ...shortcutsModule.defaultState,
    // ...apiModule.defaultState,
    // ...uiModule.defaultState,
  };

  const store = createAppStore();
 
  const Preview = () => {
    // const state = clientStore.getAll();
    const preview = provider.renderPreview(/*state.selectedKind, state.selectedStory*/);
    return preview;
  };


   const api = {
    onStory: cb => {},
    setStories: stories =>
      store.dispatch(loadStories(stories)),
  };

  provider.handleAPI(api);

  const root = (
    <ReduxProvider store={store}>
      {/*<Layout
        leftPanel={() => <LeftPanel />}
        preview={() => <Preview />}
        downPanel={() => <DownPanel />}
      />
      <ShortcutsHelp />*/}
      <SearchBox />
    </ReduxProvider>
  );

  ReactDOM.render(root, domNode);

  // const defaultState = {
  //   ...shortcutsModule.defaultState,
  //   ...apiModule.defaultState,
  //   ...uiModule.defaultState,
  // };
  // const clientStore = new Podda(defaultState);
  // clientStore.registerAPI('toggle', (store, key) => store.set(key, !store.get(key)));

  // const context = buildContext(clientStore, domNode, provider);
  // const app = createApp(context);

  // app.loadModule(shortcutsModule);
  // app.loadModule(apiModule);
  // app.loadModule(uiModule);

  // setContext(context);
  // setActions(app._bindContext(app.actions)); // eslint-disable-line

  // app.init();
}

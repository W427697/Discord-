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
import Layout from './containers/Layout';
import LeftPanel from './containers/LeftPanel';
import ShortcutsHelp from './containers/ShortcutsHelp';
import DownPanel from './containers/DownPanel';
import { loadStories } from './actions';

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

  const api = {
    callbacks: [],
    onStory(cb) {
      this.callbacks.push(cb);
    },
    setStories: stories => {
      store.dispatch(loadStories(stories));
    },
  };

  provider.handleAPI(api);

  let currentKind;
  let currentStory;
  store.subscribe(() => {
    const { selectedKind, selectedStory } = store.getState().ui;

    if (!selectedKind) return;

    if (selectedKind === currentKind && selectedStory === currentStory) {
      // No change in the selected story so avoid emitting 'story'
      return;
    }

    currentKind = selectedKind;
    currentStory = selectedStory;
    api.callbacks.forEach(callback => callback(selectedKind, selectedStory));
  });


  const Preview = () => {
    const preview = provider.renderPreview();
    return preview;
  };

  const root = (
    <ReduxProvider store={store}>
      <div>
        <Layout
          leftPanel={() => <LeftPanel />}
          preview={() => <Preview />}
          downPanel={() => <DownPanel provider={provider} />}
        />
        <ShortcutsHelp />
        <SearchBox />
      </div>
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

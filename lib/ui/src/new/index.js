// import { createApp } from 'mantra-core';
// import Podda from 'podda';

// import buildContext from './context';
// import shortcutsModule from './modules/shortcuts';
// import apiModule from './modules/api';
// import uiModule from './modules/ui';
// import { setContext, setActions } from './compose';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider as ReduxProvider, connect } from 'react-redux';
import createAppStore from './createStore';
import Mousetrap from 'mousetrap';
import { document } from 'global';
import keymap from './keymap';

// import Layout from './components/layout';
// import LeftPanel from './components/left_panel';
// import DownPanel from './components/down_panel';
// import { ShortcutsHelp } from './components/shortcuts_help';

import SearchBox from './containers/SearchBox';
import Layout from './containers/Layout';
import LeftPanel from './containers/LeftPanel';
import ShortcutsHelp from './containers/ShortcutsHelp';
import DownPanel from './containers/DownPanel';
import {
  loadStories,
  toggleFullScreen,
  toggleShortcutsHelp,
  toggleSearchBox,
} from './actions';

export class Provider {
  renderPreview() {
    throw new Error('Provider.renderPreview() is not implemented!');
  }

  handleAPI() {
    throw new Error('Provider.handleAPI() is not implemented!');
  }
}

let plugins = [];
export function registerPlugin(plugin) {
  plugins.push(plugin);
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

  const pluginMiddlwares = plugins
    .filter(plugin => plugin.middleware)
    .map(plugin => plugin.middleware);

  const pluginReducers = plugins
    .filter(plugin => plugin.reduce)
    .map(plugin => plugin.reduce);

  const store = createAppStore(pluginMiddlwares, pluginReducers);

  const keys = new Mousetrap(document);
  keymap.forEach(({ key, action }) => {
    keys.bind(key, e => {
      if (e.preventDefault) {
        e.preventDefault();
      } else {
        // internet explorer
        e.returnValue = false;
      }
      store.dispatch({ type: action });
    });
  });

  const api = {
    callbacks: [],
    onStory(cb) {
      this.callbacks.push(cb);
    },
    setStories: stories => {
      store.dispatch(loadStories(stories));
    },
    handleShortcut: action => {
      store.dispatch({ type: action });
    },
  };

  provider.handleAPI(api);

  store.subscribe(() => {
    const { selectedKind, selectedStory } = store.getState().ui;

    if (!selectedKind) return;
    api.callbacks.forEach(callback => callback(selectedKind, selectedStory));
  });

  const tmpPreview = plugins
    .filter(plugin => plugin.decoratePreview)
    .reduce((acc, plugin) => {
      return plugin.decoratePreview(acc, { React });
    }, provider.renderPreview);

  const mapPreviewState = plugins
    .filter(p => p.mapPreviewState)
    .map(p => p.mapPreviewState);

  const Preview = connect(state =>
    mapPreviewState.reduce((s, mapper) => mapper(state, s), {})
  )(tmpPreview);

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

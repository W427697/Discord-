import { types } from './actions';

export default class ConfigApi {
  constructor({ pageBus, storyStore, reduxStore }) {
    this._pageBus = pageBus;
    this._storyStore = storyStore;
    this._reduxStore = reduxStore;
  }

  _renderMain(loaders) {
    if (loaders) loaders();

    const storyKindList = this._storyStore.dumpStoryBook();
    // send to the parent frame.
    this._pageBus.emit('setStories', JSON.stringify(storyKindList));

    // clear the error if exists.
    this._reduxStore.dispatch({
      type: types.CLEAR_ERROR,
    });
    this._reduxStore.dispatch({
      type: types.SET_INITIAL_STORY,
      storyKindList,
    });
  }

  _renderError(e) {
    const { stack, message } = e;
    const error = { stack, message };

    this._reduxStore.dispatch({
      type: types.SET_ERROR,
      error,
    });
  }

  configure(loaders, module) {
    const render = () => {
      try {
        this._renderMain(loaders);
      } catch (error) {
        this._renderError(error);
      }
    };

    if (module.hot) {
      module.hot.accept(() => {
        setTimeout(render);
      });
    }

    render();
  }
}

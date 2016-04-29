import createPageBus from 'page-bus';
import QS from 'query-string';
import { selectStory } from './actions';

export default class PageBus {
  constructor(window, reduxStore) {
    this._window = window;
    this._reduxStore = reduxStore;
    this._parsedQs = QS.parse(window.location.search);
    this._dataId = this._parsedQs.dataId;
    this._pageBus = createPageBus();
  }

  _ensureDataId() {
    if (!this._dataId) {
      throw new Error('dataId is not supplied via queryString');
    }
  }

  _on(key, cb) {
    return this._pageBus.on(`${this._dataId}.${key}`, cb);
  }

  init() {
    this._ensureDataId();
    this._on('setCurrentStory', (payloadString) => {
      const { kind, story } = JSON.parse(payloadString);
      this._reduxStore.dispatch(selectStory(kind, story));
    });
  }

  emit(key, payload) {
    this._ensureDataId();
    return this._pageBus.emit(`${this._dataId}.${key}`, payload);
  }
}

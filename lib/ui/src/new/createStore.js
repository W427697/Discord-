import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import appReducer from './reducers';

const createAppStore = (pluginMiddlwares, pluginReducers) => {
  const middlewares = [thunk, logger, ...pluginMiddlwares];

  const composeEnhancers = typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__(
        {
          // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
        }
      )
    : compose;

  const enhancer = composeEnhancers(
    applyMiddleware(...middlewares)
    // other store enhancers if any
  );

  return createStore((state, action) => {
    // base reduce
    const newState = appReducer(state, action);
    return pluginReducers.reduce((tmpState, reducer) => {
      return reducer(tmpState, action);
    }, newState);

  }, enhancer);
};

export default createAppStore;

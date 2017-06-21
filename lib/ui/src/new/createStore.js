import { createStore, applyMiddleware } from 'redux';
import appReducer from './reducers';

const logger = ({ getState }) => next => action => {
  console.log('will dispatch', action);
  const returnValue = next(action);

  console.log('state after dispatch', getState());
  return returnValue;
};

const createAppStore = () => createStore(appReducer, applyMiddleware(logger));

export default createAppStore;

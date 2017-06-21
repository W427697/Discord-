import { combineReducers } from 'redux';
import storiesReducer from './stories';
import uiReducer from './ui';


const appReducer = combineReducers({ stories: storiesReducer, ui: uiReducer });

export default appReducer;

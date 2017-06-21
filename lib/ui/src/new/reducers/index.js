import { combineReducers } from 'redux';
import storiesReducer from './stories';

const currentStoryReducrer = (state = '', action) => {
  switch (action.type) {
    case '@storybook/ui/SELECT_STORY': {
      return action.name;
    }
    default:
      return state;
  }
};

const appReducer = combineReducers({ stories: storiesReducer, currentStory: currentStoryReducrer });

export default appReducer;

// define redux actions
export const types = {
  SELECT_STORY: 'PREVIEW_SELECT_STORY',
  CLEAR_ACTIONS: 'PREVIEW_CLEAR_ACTIONS',
  SET_STORIES: 'PREVIEW_SET_STORIES',
  ADD_ACTION: 'PREVIEW_ADD_ACTION',
};

import preview from './preview';

export default {
  preview,
};

import { types } from './';
import { features } from '../../../../libs/key_events';

export default {
  handleEvent({ reduxStore }, actions, event) {
    switch (event) {
      case features.NEXT_STORY:
        actions.api.jumpToStory(1);
        break;
      case features.PREV_STORY:
        actions.api.jumpToStory(-1);
        break;
      default:
        reduxStore.dispatch({
          type: types.HANDLE_EVENT,
          event,
        });
    }
  },
};

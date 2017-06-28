// import keyEvents from '@storybook/ui/dist/libs/key_events';
import Mousetrap from 'mousetrap';
import { selectStory } from './actions';

export default function(context) {
  const { queryParams, reduxStore, window, channel } = context;
  // set the story if correct params are loaded via the URL.
  if (queryParams.selectedKind) {
    reduxStore.dispatch(selectStory(queryParams.selectedKind, queryParams.selectedStory));
  }

  const keys = new Mousetrap(document);
  keys.bind('?', () => {
    channel.emit('applyShortcut', '?');
  });

}

import { types } from '../actions';

export default function (bus, reduxStore) {
  const state = reduxStore.getState();
  const dataId = state.core.dataId;

  // subscribe to redux store and send down changes to pageBus.
  reduxStore.subscribe(function () {
    const { preview } = reduxStore.getState();
    if (!preview) return;

    const payload = {
      kind: preview.selectedKind,
      story: preview.selectedStory,
    };

    bus.emit(`${dataId}.setCurrentStory`, JSON.stringify(payload));
  });
  window.a = reduxStore;

  // watch pageBus and put both actions and stories.
  bus.on(`${dataId}.addAction`, function (payload) {
    const action = JSON.parse(payload);
    reduxStore.dispatch({
      type: types.ADD_ACTION,
      action,
    });
  });

  bus.on(`${dataId}.setStories`, function (payload) {
    const stories = JSON.parse(payload);
    reduxStore.dispatch({
      type: types.SET_STORIES,
      stories,
    });
  });

  bus.on(`${dataId}.selectStory`, function (payload) {
    const data = JSON.parse(payload);
    reduxStore.dispatch({
      type: types.SELECT_STORY,
      kind: data.kind,
      story: data.story,
    });
  });
}

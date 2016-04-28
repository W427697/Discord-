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

    bus.emit(`${dataId}.currentStory`, JSON.stringify(payload));
  });

  // watch pageBus and put both actions and stories.
  bus.on(`${dataId}.action`, function (payload) {
    const action = JSON.parse(payload);
    reduxStore.dispatch({
      type: types.ADD_ACTION,
      action,
    });
  });

  bus.on(`${dataId}.stories`, function (payload) {
    const stories = JSON.parse(payload);
    reduxStore.dispatch({
      type: types.SET_STORIES,
      stories,
    });
  });
}

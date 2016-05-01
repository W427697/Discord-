export default function (bus, reduxStore, actions) {
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

  // watch pageBus and put both actions and stories.
  bus.on(`${dataId}.addAction`, function (payload) {
    const data = JSON.parse(payload);
    actions.preview.addAction(data.action);
  });

  bus.on(`${dataId}.setStories`, function (payload) {
    const data = JSON.parse(payload);
    actions.preview.setStories(data.stories);
  });

  bus.on(`${dataId}.selectStory`, function (payload) {
    const data = JSON.parse(payload);
    actions.preview.selectStory(data.kind, data.story);
  });

  bus.on(`${dataId}.applyShortcut`, function (payload) {
    const data = JSON.parse(payload);
    actions.shortcuts.handleEvent(data.event);
  });
}

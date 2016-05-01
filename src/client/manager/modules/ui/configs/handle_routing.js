import qs from 'qs';

export function changeUrl(reduxStore) {
  const { preview } = reduxStore.getState();
  if (!preview) return;

  const { selectedKind, selectedStory } = preview;
  const queryString = qs.stringify({ selectedKind, selectedStory });

  if (queryString === '') return;

  const url = `?${queryString}`;
  const state = {
    url,
    selectedKind,
    selectedStory,
  };

  window.history.pushState(state, '', url);
}

export function updateStore(queryParams, actions) {
  const { selectedKind, selectedStory } = queryParams;
  if (selectedKind && selectedStory) {
    actions.preview.selectStory(selectedKind, selectedStory);
  }
}

export function handleInitialUrl(actions) {
  const queryString = window.location.search.substring(1);
  if (!queryString || queryString === '') return;

  const parsedQs = qs.parse(queryString);
  updateStore(parsedQs, actions);
}

export default function ({ reduxStore }, actions) {
  // subscribe to reduxStore and change the URL
  reduxStore.subscribe(() => changeUrl(reduxStore));
  changeUrl(reduxStore);

  // handle initial URL
  handleInitialUrl(actions);

  // handle back button
  window.onpopstate = () => {
    handleInitialUrl(actions);
  };
}

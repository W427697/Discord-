import { document } from 'global';

import Preview from '../components/Preview.svelte';

let previousPreview = null;

export default function render({
  storyFn,
  selectedKind,
  selectedStory,
  showMain,
  // showError,
  showException,
}) {
  const Stories = storyFn();

  if (previousPreview) {
    previousPreview.$destroy();
    previousPreview = null;
  }

  const target = document.getElementById('root');

  target.innerHTML = '';

  try {
    previousPreview = new Preview({
      target,
      props: {
        Stories,
        selectedKind,
        selectedStory,
      },
    });
    showMain();
  } catch (ex) {
    showException(ex);
    // cleanup
    if (previousPreview && previousPreview.$destroy) {
      try {
        previousPreview.$destroy();
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn('Failed to destroy previous component', err);
      }
    }
    previousPreview = null;
  }
}

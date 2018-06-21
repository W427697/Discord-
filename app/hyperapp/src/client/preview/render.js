import { document } from 'global';
import { stripIndents } from 'common-tags';
import * as hyperapp from 'hyperapp';

const rootElement = document.getElementById('root');

function render(target, component) {
  hyperapp.app({}, {}, component, target);
}

export default function renderMain({ story, selectedKind, selectedStory, showMain, showError }) {
  const component = story();

  if (!component) {
    showError({
      title: `Expecting a Hyperapp component from the story: "${selectedStory}" of "${selectedKind}".`,
      description: stripIndents`
        Did you forget to return the Hyperapp component from the story?
        Use "() => (<MyComp/>)" or "() => { return <MyComp/>; }" when defining the story.
      `,
    });
    return;
  }

  showMain();
  render(rootElement, component);
}

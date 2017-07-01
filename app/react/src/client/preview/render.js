/* global document */

import React from 'react';
import ReactDOM from 'react-dom';
import { stripIndents } from 'common-tags';
import ErrorDisplay from './error_display';

// check whether we're running on node/browser
const isBrowser = typeof window !== 'undefined';

const logger = console;

const separatorRegExp = ':';

let rootEl = null;
let previousKind = '';
let previousStory = '';

if (isBrowser) {
  rootEl = document.getElementById('root');
}

// added this function to use with tests
export function setRootEl(root) {
  rootEl = root;
}

function errorElement(error) {
  const properError = new Error(error.title);
  properError.stack = error.description;

  const redBox = <ErrorDisplay error={properError} />;
  return redBox;
}

export function renderException(error) {
  // We always need to render redbox in the mainPage if we get an error.
  // Since this is an error, this affects to the main page as well.
  const realError = new Error(error.message);
  realError.stack = error.stack;
  const redBox = <ErrorDisplay error={realError} />;
  ReactDOM.render(redBox, rootEl);

  // Log the stack to the console. So, user could check the source code.
  logger.error(error.stack);
  return error;
}

function singleElement(context, storyStore) {
  const { kind, story } = context;
  const NoPreview = ({info}) => <p>{info}</p>;
  const noPreview = <NoPreview info="No Preview Available!"/>;

  const storyFn = storyStore.getStory(kind, story);
  if (!storyFn) {
    return noPreview;
  }

  const element = storyFn(context);

  if (!element) {
    const error = {
      title: `Expecting a React element from the story: "${story}" of "${kind}".`,
      description: stripIndents`
        Did you forget to return the React element from the story?
        Use "() => (<MyComp/>)" or "() => { return <MyComp/>; }" when defining the story.
      `,
    };
    return errorElement(error);
  }

  if (element.type === undefined) {
    const error = {
      title: `Expecting a valid React element from the story: "${story}" of "${kind}".`,
      description: stripIndents`
        Seems like you are not returning a correct React element from the story.
        Could you double check that?
      `,
    };
    return errorElement(error);
  }

  return element;
}

function multiElement(kindRoot, selectedStory, storyStore) {
  const kinds = storyStore.getStoryKinds();
  const selectedKinds = kinds.filter(kind => kind.match(`^${kindRoot}`));

  const StoryHolder = ({ name, element }) =>
    <div id={name}>
      {element}
    </div>;

  const stories = selectedKinds.reduce(
    (prev, kind) => prev.concat(storyStore.getStories(kind).map(story => ({ kind, story }))),
    []
  );

  return (
    <div>
      {stories.map(({ kind, story }) =>
        <StoryHolder
          key={`${kind}-${story}`}
          name={`${kind}-${story}`}
          element={singleElement({ kind, story, kindRoot, selectedStory }, storyStore)}
        />
      )}
    </div>
  );
}

export function renderMain(data, storyStore) {
  if (storyStore.size() === 0) return null;

  const { selectedKind, selectedStory } = data;

  const multiStoriesSeparator =
    selectedKind && selectedKind.match(separatorRegExp) && selectedKind.match(separatorRegExp)[0];

  // Unmount the previous story only if selectedKind or selectedStory has changed.
  // renderMain() gets executed after each action. Actions will cause the whole
  // story to re-render without this check.
  //    https://github.com/storybooks/react-storybook/issues/116
  if (selectedKind !== previousKind || previousStory !== selectedStory) {
    // We need to unmount the existing set of components in the DOM node.
    // Otherwise, React may not recrease instances for every story run.
    // This could leads to issues like below:
    //    https://github.com/storybooks/react-storybook/issues/81
    previousKind = selectedKind;
    previousStory = selectedStory;
    ReactDOM.unmountComponentAtNode(rootEl);
  }

  const kind = selectedKind;
  const story = selectedStory;

  const element = multiStoriesSeparator
    ? multiElement(
        selectedKind.split(multiStoriesSeparator)[0].concat(multiStoriesSeparator),
        selectedStory,
        storyStore
      )
    : singleElement({ kind, story }, storyStore);

  ReactDOM.render(element, rootEl);

  const currentStoryHolder = document.getElementById(`${kind}-${story}`);
  if (currentStoryHolder) currentStoryHolder.scrollIntoView();
  return element;
}

export default function renderPreview({ reduxStore, storyStore }) {
  const state = reduxStore.getState();
  if (state.error) {
    return renderException(state.error);
  }

  try {
    return renderMain(state, storyStore);
  } catch (ex) {
    return renderException(ex);
  }
}

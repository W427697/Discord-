import global from 'global';
import qs from 'qs';
import { addons, makeDecorator } from '@storybook/addons';
import { STORY_CHANGED, SELECT_STORY } from '@storybook/core-events';
import { toId, StoryId, ComponentTitle, StoryName, StoryContext } from '@storybook/csf';
import { logger } from '@storybook/client-logger';
import { PreviewWeb } from '@storybook/preview-web';
import { StoryIndex } from '@storybook/store';
import { PARAM_KEY } from './constants';

const { document, HTMLElement } = global;

interface ParamsId {
  storyId: string;
}
interface ParamsCombo {
  kind: string;
  story: string;
}

export const navigate = (params: ParamsId | ParamsCombo) =>
  addons.getChannel().emit(SELECT_STORY, params);

const generateUrl = (id: StoryId) => {
  const { location } = document;
  const query = qs.parse(location.search, { ignoreQueryPrefix: true });
  return `${location.origin + location.pathname}?${qs.stringify(
    { ...query, id },
    { encode: false }
  )}`;
};

const valueOrCall = (args: string[]) => (value: string | ((...args: string[]) => string)) =>
  typeof value === 'function' ? value(...args) : value;

// Similar to `useStoryContext` from '@storybook/addons', except works outside a decorator/story
// NOTE: this means it only tells us the 'global' rendered story, and will not do anything
// sensible if more than one story is rendered to the screen (i.e. docs)
function getStoryContext(): StoryContext {
  // eslint-disable-next-line no-underscore-dangle
  const { previousStory } = global.__STORYBOOK_PREVIEW__ as PreviewWeb;
  return global.__STORYBOOK_STORY_STORE__.getStoryContext(previousStory);
}

function getStoryIndex(): StoryIndex {
  return global.__STORYBOOK_STORY_STORE__.storyIndex;
}

export const linkTo = (
  idOrTitleInput: string,
  nameInput?: string | ((...args: any[]) => string)
) => (...args: any[]) => {
  const resolver = valueOrCall(args);
  const current = getStoryContext();
  const titleVal = resolver(idOrTitleInput);
  const nameVal = resolver(nameInput);

  const { stories } = getStoryIndex();
  const fromid = stories[titleVal];

  const item =
    fromid ||
    Object.values(stories).find((entry) => {
      if (titleVal && nameVal) {
        return entry.title === titleVal && entry.name === nameVal;
      }
      if (!titleVal && nameVal) {
        return entry.title === current.title && entry.name === nameVal;
      }
      if (titleVal && !nameVal) {
        return entry.title === titleVal;
      }
      if (!titleVal && !nameVal) {
        return entry.title === current.kind;
      }
      return false;
    });

  if (item) {
    navigate({
      kind: item.title,
      story: item.name,
    });
  } else {
    logger.error('could not navigate to provided story');
  }
};

export const hrefTo = (title: ComponentTitle, name: StoryName): Promise<string> => {
  return new Promise((resolve) => {
    const current = getStoryContext();
    resolve(generateUrl(toId(title || current.title, name)));
  });
};

const linksListener = (e: Event) => {
  const { target } = e;
  if (!(target instanceof HTMLElement)) {
    return;
  }
  const element = target as HTMLElement;
  const { sbKind: kind, sbStory: story } = element.dataset;
  if (kind || story) {
    e.preventDefault();
    navigate({ kind, story });
  }
};

let hasListener = false;

const on = () => {
  if (!hasListener) {
    hasListener = true;
    document.addEventListener('click', linksListener);
  }
};
const off = () => {
  if (hasListener) {
    hasListener = false;
    document.removeEventListener('click', linksListener);
  }
};

export const withLinks = makeDecorator({
  name: 'withLinks',
  parameterName: PARAM_KEY,
  wrapper: (storyFn, context) => {
    on();
    addons.getChannel().once(STORY_CHANGED, off);
    return storyFn(context);
  },
});

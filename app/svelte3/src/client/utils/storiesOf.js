import { setContext, getContext } from 'svelte';
import { get, set } from 'lodash';

import { storiesOf as baseStoriesOf } from '../preview';
import {
  CTX_MODULE,
  CTX_STORIES,
  CTX_DECORATORS,
  CTX_PARAMETERS,
  CTX_REGISTER,
} from '../constants';

// --- Context ---

// NOTE context functions will crash if called outside of a svelte component
// instance script with "outside of component initialization", but this is
// desirable since it indicates an incorrect usage -- and svelte's error
// message is explicit enough for our situation too

const isContextRegister = () => {
  return getContext(CTX_REGISTER);
};

const setContextStories = stories => {
  setContext(CTX_STORIES, stories);
};

const setContextModule = m => {
  setContext(CTX_MODULE, m);
};

// --- Proxies ---

// eslint-disable-next-line no-use-before-define
const noop = () => noopProxy;
const noopProxy = {
  add: noop,
  addDecorator: noop,
  addParameters: noop,
};

const contextProxy = {
  addDecorator(...args) {
    const decorators = getContext(CTX_DECORATORS) || [];
    setContext(CTX_DECORATORS, [...decorators, args]);
    return contextProxy;
  },
  addParameters(...args) {
    const parameters = getContext(CTX_PARAMETERS) || [];
    setContext(CTX_PARAMETERS, [...parameters, args]);
    return contextProxy;
  },
};

// --- HMR Disposable ---

const loadedModules = {};

const getDispose = obj => get(obj, ['hot', 'dispose']);

const rememberModule = ({ id }, kind) => {
  set(loadedModules, [id, kind], true);
};

const forgetModule = ({ id }, kind) => () => {
  delete loadedModules[id][kind];
};

const storiesOfDisposable = (kind, m) => {
  // guard: already loaded (and not disposed) => return a deactivated proxy
  //   to avoid registering again a story that is still in the stories store
  const loadedStories = get(loadedModules, [m.id, kind]);
  if (loadedStories) {
    return noopProxy;
  }
  // register kind
  const stories = baseStoriesOf(kind, m);
  // lifecycle
  const onDispose = getDispose(m);
  rememberModule(m, kind);
  onDispose(forgetModule(m, kind));
  return stories;
};

// --- custom storiesOf ---

// We need to do the dispoable dance here because of the strategy used to
// register stories from Svelte components.
//
// Or we'll get "duplicate story" warnings.
//
// In the general (non svelte) case, kinds/stories are created when the module
// is executed, that is when it is required for the first time. Subsequent
// requires (in user's project `loadConfig`) have no effects. Subsequent
// requires of hot replaced modules is handled internally in Storybook, with
// the expectation that unmodified modules won't be executed again.
//
// However, in order to extract stories written as Svelte components (that is
// have the underlying `storiesOf` and `storiesOf#add` calls executed), we need
// to actually instantiate those components (in "register" mode). Blindly doing
// so for already required and registered modules would result in duplicate
// calls of `storiesOf` and `add` for modules that have not been modified (and
// hot reloaded). And so, our solutions is as follow:
//
// - Keep track of already registered kinds & stories by a given module.
//
// - Do not recreate stories components (i.e. register again) for modules
//   that have been remembered.
//
// - Forget a module when it is hot disposed, so that hot updates are taken
//   into account. This will not result in a warning, because Storybook's
//   core also listen on module.hot.dispose to know when to expect an updated
//   story to be registered again.
//
// Further, we cannot do all this in our `loadSvelteStories`, where it would
// arguably be better located (closer to the actual "svelte stories" concern
// and code). Indeed we need access to the `module` (and module.hot.dispose) of
// the file where `storiesOf` is called. And this `module` only becomes visible
// to us when `storiesOf` is actually called and, as elaborated above, merely
// requiring the module isn't enough to trigger calls to `storiesOf` and
// `storiesOf#add` for stories as Svelte components.
//
const storiesOf = (kind, m) => {
  if (!isContextRegister()) {
    return noopProxy;
  }
  // partial storiesOf(module): store module in context and wait for the
  // StoriesOf component
  if (typeof kind === 'object' && !m && kind.id != null) {
    setContextModule(kind);
    return contextProxy;
  }
  const isHotDisposable = getDispose(m);
  const stories = isHotDisposable ? storiesOfDisposable(kind, m) : baseStoriesOf(kind, m);
  setContextStories(stories);
  return stories;
};

export default storiesOf;

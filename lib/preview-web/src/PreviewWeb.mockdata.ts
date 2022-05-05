import { EventEmitter } from 'events';
import Events from '@storybook/core-events';
import { StoryIndex } from '@storybook/store';

export const componentOneExports = {
  default: {
    title: 'Component One',
    argTypes: {
      foo: { type: { name: 'string' } },
    },
    loaders: [jest.fn()],
    parameters: {
      docs: { container: jest.fn() },
    },
  },
  a: { args: { foo: 'a' }, play: jest.fn() },
  b: { args: { foo: 'b' }, play: jest.fn() },
};
export const componentTwoExports = {
  default: { title: 'Component Two' },
  c: { args: { foo: 'c' } },
};
export const legacyDocsExports = {
  default: { title: 'Introduction' },
  Docs: { parameters: { docs: { page: jest.fn() } } },
};
export const modernDocsExports = {
  default: jest.fn(),
};
export const importFn = jest.fn(
  async (path) =>
    ({
      './src/ComponentOne.stories.js': componentOneExports,
      './src/ComponentTwo.stories.js': componentTwoExports,
      './src/Legacy.stories.mdx': legacyDocsExports,
      './src/Introduction.docs.mdx': modernDocsExports,
    }[path])
);

export const docsRenderer = {
  render: jest.fn().mockImplementation((context, parameters, element, cb) => cb()),
  unmount: jest.fn(),
};
export const projectAnnotations = {
  globals: { a: 'b' },
  globalTypes: {},
  decorators: [jest.fn((s) => s())],
  render: jest.fn(),
  renderToDOM: jest.fn(),
  parameters: { docs: { renderer: () => docsRenderer } },
};
export const getProjectAnnotations = () => projectAnnotations;

export const storyIndex: StoryIndex = {
  v: 4,
  entries: {
    'component-one--a': {
      id: 'component-one--a',
      title: 'Component One',
      name: 'A',
      importPath: './src/ComponentOne.stories.js',
    },
    'component-one--b': {
      id: 'component-one--b',
      title: 'Component One',
      name: 'B',
      importPath: './src/ComponentOne.stories.js',
    },
    'component-two--c': {
      id: 'component-two--c',
      title: 'Component Two',
      name: 'C',
      importPath: './src/ComponentTwo.stories.js',
    },
    'introduction--docs': {
      type: 'docs',
      id: 'introduction--docs',
      title: 'Introduction',
      name: 'Docs',
      importPath: './src/Introduction.docs.mdx',
      storiesImports: ['./src/ComponentTwo.stories.js'],
    },
    'legacy--docs': {
      type: 'docs',
      legacy: true,
      id: 'legacy--docs',
      title: 'Legacy',
      name: 'Docs',
      importPath: './src/Legacy.stories.mdx',
      storiesImports: [],
    },
  },
};
export const getStoryIndex = () => storyIndex;

export const emitter = new EventEmitter();
export const mockChannel = {
  on: emitter.on.bind(emitter),
  off: emitter.off.bind(emitter),
  removeListener: emitter.off.bind(emitter),
  emit: jest.fn(emitter.emit.bind(emitter)),
  // emit: emitter.emit.bind(emitter),
};

export const waitForEvents = (
  events: string[],
  predicate: (...args: any[]) => boolean = () => true
) => {
  // We've already emitted a render event. NOTE if you want to test a second call,
  // ensure you call `mockChannel.emit.mockClear()` before `waitFor...`
  if (
    mockChannel.emit.mock.calls.find(
      (call) => events.includes(call[0]) && predicate(...call.slice(1))
    )
  ) {
    return Promise.resolve(null);
  }

  return new Promise((resolve, reject) => {
    const listener = (...args: any[]) => {
      if (!predicate(...args)) return;
      events.forEach((event) => mockChannel.off(event, listener));
      resolve(null);
    };
    events.forEach((event) => mockChannel.on(event, listener));

    // Don't wait too long
    waitForQuiescence().then(() => reject(new Error('Event was not emitted in time')));
  });
};

// The functions on the preview that trigger rendering don't wait for
// the async parts, so we need to listen for the "done" events
export const waitForRender = () =>
  waitForEvents([
    Events.STORY_RENDERED,
    Events.DOCS_RENDERED,
    Events.STORY_THREW_EXCEPTION,
    Events.STORY_ERRORED,
    Events.STORY_MISSING,
  ]);

export const waitForRenderPhase = (phase) =>
  waitForEvents([Events.STORY_RENDER_PHASE_CHANGED], ({ newPhase }) => newPhase === phase);

// A little trick to ensure that we always call the real `setTimeout` even when timers are mocked
const realSetTimeout = setTimeout;
export const waitForQuiescence = async () => new Promise((r) => realSetTimeout(r, 100));

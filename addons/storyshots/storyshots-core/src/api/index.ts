import global from 'global';
import { addons, mockChannel } from '@storybook/addons';
import { Story, StoryIndexEntry, StoryStore } from '@storybook/store';
import { AnyFramework, ComponentTitle, LegacyStoryFn } from '@storybook/csf';

import ensureOptionsDefaults from './ensureOptionsDefaults';
import snapshotsTests from './snapshotsTestsTemplate';
import integrityTest from './integrityTestTemplate';
import loadFramework from '../frameworks/frameworkLoader';
import { StoryshotsOptions } from './StoryshotsOptions';

const { describe } = global;
global.STORYBOOK_REACT_CLASSES = global.STORYBOOK_REACT_CLASSES || {};

type TestMethod = 'beforeAll' | 'beforeEach' | 'afterEach' | 'afterAll';
const methods: TestMethod[] = ['beforeAll', 'beforeEach', 'afterEach', 'afterAll'];

function callTestMethodGlobals(
  testMethod: { [key in TestMethod]?: Function & { timeout?: number } } & { [key in string]: any }
) {
  methods.forEach((method) => {
    if (typeof testMethod[method] === 'function') {
      global[method](testMethod[method], testMethod[method].timeout);
    }
  });
}

const isDisabled = (parameter: any) =>
  parameter === false || (parameter && parameter.disable === true);
function testStorySnapshots(options: StoryshotsOptions = {}) {
  if (typeof describe !== 'function') {
    throw new Error('testStorySnapshots is intended only to be used inside jest');
  }

  addons.setChannel(mockChannel());

  const { framework, renderTree, renderShallowTree } = loadFramework(options);
  const {
    asyncJest,
    suite,
    storyNameRegex,
    storyKindRegex,
    stories2snapsConverter,
    testMethod,
    integrityOptions,
    snapshotSerializers,
  } = ensureOptionsDefaults(options);
  const testMethodParams = {
    renderTree,
    renderShallowTree,
    stories2snapsConverter,
  };

  const store = global.__STORYBOOK_STORY_STORE__ as StoryStore<AnyFramework>;

  const data = Object.values(store.storyIndex.stories).reduce(
    (acc, item) => {
      if (storyNameRegex && !item.name.match(storyNameRegex)) {
        return acc;
      }

      if (storyKindRegex && !item.title.match(storyKindRegex)) {
        return acc;
      }

      const { id, title } = item;
      const existing = acc.find((i) => i.title === title);

      const getStory = async () => store.loadStory({ storyId: id });
      const getRender = async () => {
        const story = await getStory();
        return () =>
          story.unboundStoryFn({
            ...store.getStoryContext(story),
            viewMode: 'story',
          } as any);
      };
      // FIXME
      // if (!isDisabled(parameters.storyshots)) {
      if (existing) {
        existing.children.push({ ...item, getStory, getRender });
      } else {
        acc.push({
          title,
          children: [{ ...item, getStory, getRender }] as any,
        });
      }
      // }
      return acc;
    },
    [] as {
      title: ComponentTitle;
      children: StoryIndexEntry &
        {
          getStory: () => Promise<Story<AnyFramework>>;
          getRender: () => Promise<LegacyStoryFn<AnyFramework>>;
        }[];
    }[]
  );

  if (data.length) {
    callTestMethodGlobals(testMethod);

    snapshotsTests({
      data,
      asyncJest,
      suite,
      framework,
      testMethod,
      testMethodParams,
      snapshotSerializers,
    });

    integrityTest(integrityOptions, stories2snapsConverter);
  } else {
    throw new Error('storyshots found 0 stories');
  }
}

export default testStorySnapshots;

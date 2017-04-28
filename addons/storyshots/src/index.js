import renderer from 'react-test-renderer';
import path from 'path';
import readPkgUp from 'read-pkg-up';
import addons from '@storybook/addons';
import runWithRequireContext from './require_context';
import createChannel from './storybook-channel-mock';
const { describe, it, expect } = global;

let storybook;
let configPath;

const babel = require('babel-core');

function hasDependency(pkg, dependency) {
  return (pkg.devDependencies && pkg.devDependencies[dependency]) ||
         (pkg.dependencies && pkg.dependencies[dependency]) ||
         (pkg.name === dependency);
}

const pkg = readPkgUp.sync().pkg;

const isStorybook = hasDependency(pkg, '@storybook/react') || pkg.name === 'storybook';
const isRNStorybook = hasDependency(pkg, '@storybook/react-native');

export default function testStorySnapshots(options = {}) {
  addons.setChannel(createChannel());

  if (isStorybook) {
    storybook = require.requireActual('@storybook/react');
    const loadBabelConfig = require('@storybook/react/dist/server/babel_config').default;
    const configDirPath = path.resolve(options.configPath || '.storybook');
    configPath = path.join(configDirPath, 'config.js');

    const content = babel.transformFileSync(configPath, babelConfig).code;
    const contextOpts = {
      filename: configPath,
      dirname: configDirPath,
    };
    const babelConfig = loadBabelConfig(configDirPath);

    runWithRequireContext(content, contextOpts);
  } else if (isRNStorybook) {
    storybook = require.requireActual('@storybook/react-native');
    configPath = path.resolve(options.configPath || 'storybook');
    require.requireActual(configPath);
  } else {
    throw new Error('storyshots is intended only to be used with storybook');
  }

  if (typeof describe !== 'function') {
    throw new Error('testStorySnapshots is intended only to be used inside jest');
  }

  const suit = options.suit || 'Storyshots';
  const stories = storybook.getStorybook();

  // Added not to break existing storyshots configs (can be removed in a future major release)
  options.storyNameRegex = options.storyNameRegex || options.storyRegex;

  for (const group of stories) {
    if (options.storyKindRegex && !group.kind.match(options.storyKindRegex)) {
      continue;
    }

    describe(suit, () => {
      describe(group.kind, () => {
        for (const story of group.stories) {
          if (options.storyNameRegex && !story.name.match(options.storyNameRegex)) {
            continue;
          }

          it(story.name, () => {
            const context = { kind: group.kind, story: story.name };
            const renderedStory = story.render(context);
            const tree = renderer.create(renderedStory, options.rendererOptions).toJSON();
            expect(tree).toMatchSnapshot();
          });
        }
      });
    });
  }
}

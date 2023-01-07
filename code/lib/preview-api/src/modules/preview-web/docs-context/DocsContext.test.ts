import { Channel } from '@storybook/channels';
import type { Renderer, CSFFile, PreparedStory } from '@storybook/types';
import type { StoryStore } from '../../store';

import { DocsContext } from './DocsContext';

const channel = new Channel();
const renderStoryToElement = jest.fn();

describe('resolveModuleExport', () => {
  // These compose the raw exports of the CSF file
  const component = {};
  const metaExport = { component };
  const storyExport = {};
  const moduleExports = { default: metaExport, story: storyExport };

  // This is the prepared story + CSF file after SB has processed them
  const storyAnnotations = {
    id: 'meta--story',
    moduleExport: storyExport,
  } as CSFFile['stories'][string];
  const story = { id: 'meta--story', moduleExport: storyExport } as PreparedStory;
  const meta = { id: 'meta', title: 'Meta', component, moduleExports } as CSFFile['meta'];
  const csfFile = {
    stories: { story: storyAnnotations },
    meta,
    moduleExports,
  } as CSFFile;

  const store = {
    componentStoriesFromCSFFile: () => [story],
  } as unknown as StoryStore<Renderer>;
  const context = new DocsContext(channel, store, renderStoryToElement, [csfFile]);

  it('works for story exports', () => {
    expect(context.resolveModuleExport(storyExport)).toEqual({ type: 'story', story });
  });

  it('works for meta exports', () => {
    expect(context.resolveModuleExport(metaExport)).toEqual({ type: 'meta', csfFile });
  });

  it('works for full module exports', () => {
    expect(context.resolveModuleExport(moduleExports)).toEqual({ type: 'meta', csfFile });
  });

  it('works for components', () => {
    expect(context.resolveModuleExport(component)).toEqual({ type: 'component', component });
  });
});

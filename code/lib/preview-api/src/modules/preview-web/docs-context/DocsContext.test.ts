import { Channel } from '@storybook/channels';
import type { Renderer } from '@storybook/types';
import type { StoryStore } from '../../store';

import { DocsContext } from './DocsContext';
import { csfFileParts } from './test-utils';

const channel = new Channel();
const renderStoryToElement = jest.fn();

describe('resolveModuleExport', () => {
  const { story, csfFile, storyExport, metaExport, moduleExports, component } = csfFileParts();

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

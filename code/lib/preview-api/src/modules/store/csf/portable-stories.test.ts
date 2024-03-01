// @vitest-environment node
import { describe, expect, vi, it } from 'vitest';
import type {
  ComponentAnnotations as Meta,
  StoryAnnotationsOrFn as Story,
  Store_CSFExports,
} from '@storybook/types';

import { composeStory, composeStories, setProjectAnnotations } from './portable-stories';

type StoriesModule = Store_CSFExports & Record<string, any>;

// Most integration tests for this functionality are located under renderers/react
describe('composeStory', () => {
  const meta: Meta = {
    title: 'Button',
    parameters: {
      firstAddon: true,
    },
    args: {
      label: 'Hello World',
      primary: true,
    },
  };

  it('should return story with composed annotations from story, meta and project', () => {
    const decoratorFromProjectAnnotations = vi.fn((StoryFn) => StoryFn());
    const decoratorFromStoryAnnotations = vi.fn((StoryFn) => StoryFn());
    setProjectAnnotations([
      {
        parameters: { injected: true },
        globalTypes: {
          locale: { defaultValue: 'en' },
        },
        decorators: [decoratorFromProjectAnnotations],
      },
    ]);

    const Story: Story = {
      render: () => {},
      args: { primary: true },
      parameters: {
        secondAddon: true,
      },
      decorators: [decoratorFromStoryAnnotations],
    };

    const composedStory = composeStory(Story, meta);
    expect(composedStory.args).toEqual({ ...Story.args, ...meta.args });
    expect(composedStory.parameters).toEqual(
      expect.objectContaining({ ...Story.parameters, ...meta.parameters })
    );

    composedStory();

    expect(decoratorFromProjectAnnotations).toHaveBeenCalledOnce();
    expect(decoratorFromStoryAnnotations).toHaveBeenCalledOnce();
  });

  it('should compose with a play function', async () => {
    const spy = vi.fn();
    const Story: Story = () => {};
    Story.args = {
      primary: true,
    };
    Story.play = async (context: any) => {
      spy(context);
    };

    const composedStory = composeStory(Story, meta);
    await composedStory.play!({ canvasElement: null });
    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        args: {
          ...Story.args,
          ...meta.args,
        },
      })
    );
  });

  it('should throw an error if Story is undefined', () => {
    expect(() => {
      // @ts-expect-error (invalid input)
      composeStory(undefined, meta);
    }).toThrow();
  });

  describe('Id of the story', () => {
    it('is exposed correctly when composeStories is used', () => {
      const module: StoriesModule = {
        default: {
          title: 'Example/Button',
        },
        CSF3Primary: () => {},
      };
      const Primary = composeStory(module.CSF3Primary, module.default, {});
      expect(Primary.id).toBe('example-button--csf-3-primary');
    });
    it('is exposed correctly when composeStory is used and exportsName is passed', () => {
      const module: StoriesModule = {
        default: {
          title: 'Example/Button',
        },
        CSF3Primary: () => {},
      };
      const Primary = composeStory(module.CSF3Primary, module.default, {}, {}, 'overwritten');
      expect(Primary.id).toBe('example-button--overwritten');
    });
    it("is not unique when composeStory is used and exportsName isn't passed", () => {
      const Primary = composeStory({ render: () => {} }, {});
      expect(Primary.id).toContain('composedstory--unnamed-story');
    });
  });
});

describe('composeStories', () => {
  const composeStoryFn = vi.fn((v) => v);
  const defaultAnnotations = { render: () => '' };
  it('should call composeStoryFn with stories', () => {
    const composeStorySpy = vi.fn((v) => v);
    const module: StoriesModule = {
      default: {
        title: 'Button',
      },
      StoryOne: () => {},
      StoryTwo: () => {},
    };
    const globalConfig = {};
    composeStories(module, globalConfig, composeStorySpy);
    expect(composeStorySpy).toHaveBeenCalledWith(
      module.StoryOne,
      module.default,
      globalConfig,
      'StoryOne'
    );
    expect(composeStorySpy).toHaveBeenCalledWith(
      module.StoryTwo,
      module.default,
      globalConfig,
      'StoryTwo'
    );
  });

  it('should not call composeStoryFn for non-story exports', () => {
    const composeStorySpy = vi.fn((v) => v);
    const module: StoriesModule = {
      default: {
        title: 'Button',
        excludeStories: /Data/,
      },
      mockData: {},
    };
    composeStories(module, defaultAnnotations, composeStoryFn);
    expect(composeStorySpy).not.toHaveBeenCalled();
  });

  describe('non-story exports', () => {
    it('should filter non-story exports with excludeStories', () => {
      const StoryModuleWithNonStoryExports: StoriesModule = {
        default: {
          title: 'Some/Component',
          excludeStories: /.*Data/,
        },
        LegitimateStory: () => 'hello world',
        mockData: {},
      };

      const result = composeStories(
        StoryModuleWithNonStoryExports,
        defaultAnnotations,
        composeStoryFn
      );
      expect(Object.keys(result)).not.toContain('mockData');
    });

    it('should filter non-story exports with includeStories', () => {
      const StoryModuleWithNonStoryExports: StoriesModule = {
        default: {
          title: 'Some/Component',
          includeStories: /.*Story/,
        },
        LegitimateStory: () => 'hello world',
        mockData: {},
      };

      const result = composeStories(
        StoryModuleWithNonStoryExports,
        defaultAnnotations,
        composeStoryFn
      );
      expect(Object.keys(result)).not.toContain('mockData');
    });
  });
});

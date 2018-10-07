import { storiesOf } from '../index';
import { NgStoryMetadata, NgStoryModuleMetadata } from '../../../../index';

export function NgStoryModule(config: NgStoryModuleMetadata) {
  return function(target: Function) {
    const constructor = target;
    constructor.prototype.stories = config.stories;

    if (config.name) {
      constructor.prototype.name = config.name;
    }

    return constructor;
  };
}

export function NgStory(config: NgStoryMetadata) {
  return function(target: Function) {
    return (moduleName?: string) => {
      const storyConfig = { ...config };

      if (moduleName) {
        storyConfig.kind = `${moduleName}|${storyConfig.kind}`;
      }

      const story = storiesOf(storyConfig.kind, module);

      if (config.parameters.addons && config.parameters.addons.length) {
        config.parameters.addons.forEach((a: any) => story.addDecorator(a));
      }

      story.add(storyConfig.name, () => storyConfig.parameters);
    };
  };
}

export function ngBootstrapStoryModule(StoryModule: any) {
  const module = new StoryModule();

  module.stories.forEach((Story: any) => new Story(module.name));
}

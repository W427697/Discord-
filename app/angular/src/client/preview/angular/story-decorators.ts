import { storiesOf } from '../index';
import { IStoryContext, NgStoryModuleConfig } from '../../../../index';

export function NgStoryModule(config: NgStoryModuleConfig) {
  return function(target: Function) {
    const constructor = target;
    constructor.prototype.stories = config.stories;

    if (config.name) {
      constructor.prototype.name = config.name;
    }

    return constructor;
  };
}

export function NgStory(config: IStoryContext) {
  return function(target: Function) {
    return (moduleName?: string) => {
      const storyConfig = { ...config };

      if (moduleName) {
        storyConfig.kind = `${moduleName}|${storyConfig.kind}`;
      }

      storiesOf(storyConfig.kind, module).add(storyConfig.name, () => storyConfig.parameters);
    };
  };
}

export function ngBootstrapStoryModule(StoryModule: any) {
  const module = new StoryModule();

  module.stories.forEach((Story: any) => new Story(module.name));
}

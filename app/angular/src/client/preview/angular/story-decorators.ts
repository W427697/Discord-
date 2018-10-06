import { storiesOf } from '../index';
import { IStoryContext, NgStoryModuleConfig } from '../../../../index';

export function NgStoryModule(config: NgStoryModuleConfig) {
  return function(target: Function) {
    const constructor = target;
    constructor.prototype.stories = config.stories;

    return constructor;
  };
}

export function NgStory(config: IStoryContext) {
  return function(target: Function) {
    return () => {
      storiesOf(config.kind, module).add(config.name, () => config.parameters);
    };
  };
}

export function ngBootstrapStoryModule(StoryModule: any) {
  const module = new StoryModule();

  module.stories.forEach((Story: any) => new Story());
}

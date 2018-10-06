import { storiesOf } from '../index';
import { IStoryContext } from '../../../../index';

export function NgStoryModule(config: { stories: Function[] }) {
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

export function ngBootstrapStoryModule(storyModule: any) {
  const module = new storyModule();

  module.stories.forEach((s: any) => new s());
}

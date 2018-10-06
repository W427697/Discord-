import { storiesOf } from '../index';
import { IStoryContext } from '../../../../index';

export function NgStory(config: IStoryContext) {
  return function(target: Function) {
    return () => {
      const story = storiesOf(config.kind, module).add(config.name, () => config.parameters);

      console.log(story);
    };
  };
}

export interface IStoryConfig {
  kind: string;
}

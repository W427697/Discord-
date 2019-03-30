import { start } from '@storybook/core/client';
import { moduleMetadata } from './angular/decorators';
import './globals';
import render from './render';

const { clientApi, configApi, forceReRender } = start(render);

export const {
  setAddon,
  addDecorator,
  addParameters,
  clearDecorators,
  getStorybook,
  raw,
} = clientApi;

const coreStoriesOf = clientApi.storiesOf;

const classToStoryName = cmpClass => cmpClass.name.replace(/Component$/, '');

export const storiesOf = (a1, a2, a3) => {
  let kind;
  let m;
  let cmpClass;

  if (typeof a1 === 'function') {
    cmpClass = a1;
    kind = classToStoryName(a1);
    m = a2;
  } else if (typeof a1 === 'string') {
    if (typeof a2 === 'function') {
      cmpClass = a2;
      kind = `${a1}/${classToStoryName(a2)}`;
      m = a3;
    } else {
      kind = a1;
      m = a2;
    }
  }

  if (cmpClass) {
    return coreStoriesOf(kind, m).addDecorator(
      moduleMetadata({
        declarations: [cmpClass],
      })
    );
  }
  return coreStoriesOf(kind, m);
};

export const { configure } = configApi;
export { forceReRender };

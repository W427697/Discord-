import { AbstractRenderer } from './AbstractRenderer';
import { StoryFnAngularReturnType, Parameters } from '../types';

export class DocsRenderer extends AbstractRenderer {
  public async render(options: {
    storyFnAngular: StoryFnAngularReturnType;
    forced: boolean;
    component: any;
    parameters: Parameters;
    targetDOMNode: HTMLElement;
  }) {
    await super.render({ ...options, forced: false });
  }

  async beforeFullRender(): Promise<void> {}

  async afterFullRender(): Promise<void> {}
}

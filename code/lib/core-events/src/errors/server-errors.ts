import dedent from 'ts-dedent';
import { StorybookError } from './storybook-error';

export enum Category {
  CLI_INIT = 'CLI_INIT',
}

export class NxProjectDetectedError extends StorybookError {
  readonly category = Category.CLI_INIT;

  readonly code = 1;

  public readonly documentation = 'https://nx.dev/packages/storybook';

  template() {
    return dedent`
      We have detected Nx in your project. Nx has its own Storybook initializer, so please use it instead.
      Run "nx g @nx/storybook:configuration" to add Storybook to your project.
    `;
  }
}

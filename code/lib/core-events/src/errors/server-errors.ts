import dedent from 'ts-dedent';
import { defineError } from './define-error';

export enum Category {
  CLI_INIT = 'CLI_INIT',
}

export const NX_PROJECT_DETECTED = defineError({
  category: Category.CLI_INIT,
  code: 1,
  documentation: 'https://nx.dev/packages/storybook',
  template: dedent`
    We have detected Nx in your project. Nx has its own Storybook initializer, so please use it instead.
    Run "nx g @nx/storybook:configuration" to add Storybook to your project.
  `,
});

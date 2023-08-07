import dedent from 'ts-dedent';
import { StorybookError } from './storybook-error';

export enum Category {
  PREVIEW_API = 'PREVIEW_API',
  MANAGER = 'MANAGER',
}

export class MissingStoryAfterHmr extends StorybookError {
  readonly category = Category.PREVIEW_API;

  readonly code = 1;

  readonly telemetry = true;

  constructor(public storyId: string) {
    super();
  }

  template() {
    return dedent`Couldn't find story matching '${this.storyId}' after HMR.
    - Did you just rename a story?
    - Did you remove it from your CSF file?
    - Are you sure a story with that id exists?
    - Please check the stories field of your main.js config.
    - Also check the browser console and terminal for potential error messages.`;
  }
}

export class ProviderDoesNotExtendBaseProvider extends StorybookError {
  readonly category = Category.MANAGER;

  readonly code = 2;

  readonly telemetry = true;

  template() {
    return `The Provider passed into Storybook's UI is not extended from the base Provider. Please check your Provider implementation.`;
  }
}

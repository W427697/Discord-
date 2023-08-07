import { StorybookError } from './storybook-error';

export enum Category {
  MANAGER = 'MANAGER',
}

export class ProviderDoesNotExtendBaseProvider extends StorybookError {
  readonly category = Category.MANAGER;

  readonly code = 1;

  readonly telemetry = true;

  template() {
    return `The Provider passed into Storybook's UI is not extended from the base Provider. Please check your Provider implementation.`;
  }
}

import { defineError } from './define-error';

export enum Category {
  MANAGER = 'MANAGER',
}

// maybe have categories specific to the files
// TODO: Linter rule to make codes unique under code/lib/core-events/src/errors files
// force people to either use error categorization (for user facing errors) or HandledError implementation (for internal errors)
// change code to number, add leading zeroes to code inside of function
// make eslint error if numbers are identical between errors

export const PROVIDER_DOES_NOT_EXTEND_BASE_PROVIDER = defineError({
  category: Category.MANAGER,
  code: 1,
  telemetry: true,
  template: () =>
    `The Provider passed into Storybook's UI is not extended from the base Provider. Please check your Provider implementation.`,
});

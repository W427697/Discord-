import { getMigrationSummary } from './getMigrationSummary';

export default {
  title: 'Automigrations',
};

export const NoMigrations = () =>
  getMigrationSummary(
    {
      // @ts-expect-error bla
      newFrameworks: 'unnecessary',
    },
    { succeeded: [], failed: {} }
  );

export const SuccessOnly = () =>
  getMigrationSummary(
    {
      // @ts-expect-error bla
      newFrameworks: 'succeeded',
    },
    { succeeded: ['newFrameworks'], failed: {} }
  );

export const SuccessAndFailure = () =>
  getMigrationSummary(
    {
      // @ts-expect-error bla
      newFrameworks: 'succeeded',
      // @ts-expect-error bla
      mainjsFramework: 'check_failed',
    },
    { succeeded: ['newFrameworks'], failed: { mainjsFramework: 'Problems!' } }
  );

export const FailureOnly = () =>
  getMigrationSummary(
    {
      // @ts-expect-error bla
      newFrameworks: 'check_failed',
    },
    { succeeded: [], failed: { newFrameworks: 'Problems!' } }
  );

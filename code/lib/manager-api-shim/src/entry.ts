import { deprecate } from '@junk-temporary-prototypes/client-logger';

deprecate(
  'importing from @junk-temporary-prototypes/api is deprecated and will be removed in 8.0, please import manager related modules from @junk-temporary-prototypes/manager-api'
);

export * from '@junk-temporary-prototypes/manager-api';

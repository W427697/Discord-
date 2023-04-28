import { deprecate } from '@junk-temporary-prototypes/client-logger';

deprecate(
  'importing from @junk-temporary-prototypes/client-api is deprecated and will be removed in 8.0, please import canvas related modules from @junk-temporary-prototypes/preview-api'
);

export * from '@junk-temporary-prototypes/preview-api/dist/client-api';

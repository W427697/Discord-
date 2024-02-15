// import { beforeMount, afterMount } from '@playwright/experimental-ct-react/hooks';
import { setProjectAnnotations } from '@storybook/react';
import sbAnnotations from '../.storybook/preview';
import {
  // StorybookHooksConfig,
  // afterMount as sbAfterMount,
  // beforeMount as sbBeforeMount,
  // bootstrap,
} from './storybook-utils';

setProjectAnnotations(sbAnnotations);

// OPTION 1: provide a bootstrap fn that receives their beforeMount and afterMount hooks
// bootstrap({ beforeMount: () => {}, afterMount });

// OPTION 2: provide hooks for users to add to their own hooks config
// beforeMount<StorybookHooksConfig>(async ({ hooksConfig }) => {
//   await sbBeforeMount({ hooksConfig });
// });
// or inline beforeMount(sbBeforeMount);

// afterMount(async () => {
//   // some other code here
//   await sbAfterMount();
// });
// or inline afterMount(sbAfterMount);

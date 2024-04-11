import { fn } from '@storybook/test';

// re-exports of the actual module
export * from 'next/cache.actual';

// mock utilities/overrides
export const revalidatePath = fn().mockName('revalidatePath');

import { fn } from '@storybook/test';

// re-exports of the actual module
export * from 'next/cache.actual';

// mock utilities/overrides (as of Next v14.2.0)
export const revalidatePath = fn().mockName('revalidatePath');
export const revalidateTag = fn().mockName('revalidateTag');

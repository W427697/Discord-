import { fn } from '@storybook/test';

export * from 'next/cache.actual';
export const revalidatePath = fn().mockName('revalidatePath');

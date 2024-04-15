import { fn } from '@storybook/test';
import { unstable_cache } from 'next/dist/server/web/spec-extension/unstable-cache';
import { unstable_noStore } from 'next/dist/server/web/spec-extension/unstable-no-store';

// mock utilities/overrides (as of Next v14.2.0)
const revalidatePath = fn().mockName('revalidatePath');
const revalidateTag = fn().mockName('revalidateTag');

const cacheExports = {
  unstable_cache,
  revalidateTag,
  revalidatePath,
  unstable_noStore,
};

export default cacheExports;
export { unstable_cache, revalidateTag, revalidatePath, unstable_noStore };

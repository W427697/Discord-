import type { Decorator } from '@storybook/svelte';

// eslint-disable-next-line import/no-extraneous-dependencies
import SvelteDecorator from '@storybook/sveltekit/src/components/SvelteDecorator.svelte';
import { setAfterNavigateArgument } from './mocks/app/navigation';
import { setNavigating, setPage, setUpdated } from './mocks/app/stores';

export const decorators: Decorator[] = [
  (Story, ctx) => {
    setPage(ctx.parameters?.sveltekit?.stores?.page);
    setUpdated(ctx.parameters?.sveltekit?.stores?.updated);
    setNavigating(ctx.parameters?.sveltekit?.stores?.navigating);
    setAfterNavigateArgument(ctx.parameters?.sveltekit?.navigation?.afterNavigate);
    return Story();
  },
  (_, ctx) => ({ Component: SvelteDecorator, props: { ctx } }),
];

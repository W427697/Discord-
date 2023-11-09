import type { Decorator } from '@storybook/svelte';

// eslint-disable-next-line import/no-extraneous-dependencies
import LinkListener from '@storybook/sveltekit/src/components/LinkListener.svelte';
import { setDeserializeResponse } from './mocks/app/forms';
import { setAfterNavigateArgument } from './mocks/app/navigation';
import { setNavigating, setPage, setUpdated } from './mocks/app/stores';

export const decorators: Decorator[] = [
  (Story, ctx) => {
    setPage(ctx.parameters?.sveltekit?.stores?.page);
    setUpdated(ctx.parameters?.sveltekit?.stores?.updated);
    setNavigating(ctx.parameters?.sveltekit?.stores?.navigating);
    setDeserializeResponse(ctx.parameters?.sveltekit?.forms?.deserializeResponse);
    setAfterNavigateArgument(ctx.parameters?.sveltekit?.navigation?.afterNavigate);
    return Story();
  },
  (_, ctx) => ({ Component: LinkListener, props: { ctx } }),
];

import type { Decorator } from '@storybook/svelte';

import { onMount } from 'svelte';
import { setAfterNavigateArgument } from './mocks/app/navigation';
import { setNavigating, setPage, setUpdated } from './mocks/app/stores';

export const decorators: Decorator[] = [
  (Story, ctx) => {
    setPage(ctx.parameters?.sveltekit?.stores?.page);
    setUpdated(ctx.parameters?.sveltekit?.stores?.updated);
    setNavigating(ctx.parameters?.sveltekit?.stores?.navigating);
    setAfterNavigateArgument(ctx.parameters?.sveltekit?.navigation?.afterNavigate);

    onMount(() => {
      const globalClickListener = (e: MouseEvent) => {
        const path = e.composedPath();
        const hasLink = path.findLast((el) => el instanceof HTMLElement && el.tagName === 'A');
        if (hasLink && hasLink instanceof HTMLAnchorElement) {
          const to = hasLink.getAttribute('href');
          if (ctx?.parameters?.sveltekit?.linkOverrides && to) {
            Object.entries(ctx.parameters.sveltekit.linkOverrides).forEach(([link, override]) => {
              if (override instanceof Function) {
                const regex = new RegExp(link);
                if (regex.test(to)) {
                  override();
                }
              }
            });
          }
          e.preventDefault();
        }
      };

      function createListeners(baseModule: string, functions: string[]) {
        const toRemove: Array<{
          eventType: string;
          listener: (event: { detail: any[] }) => void;
        }> = [];
        functions.forEach((func) => {
          if (
            ctx?.parameters?.sveltekit?.[baseModule]?.[func] &&
            ctx.parameters.sveltekit[baseModule][func] instanceof Function
          ) {
            const listener = ({ detail = [] as any[] }) => {
              const args = Array.isArray(detail) ? detail : [];
              ctx.parameters.sveltekit[baseModule][func](...args);
            };
            const eventType = `storybook:${func}`;
            toRemove.push({ eventType, listener });
            // @ts-expect-error apparently you can't add a custom listener to the window with TS
            window.addEventListener(eventType, listener);
          }
        });
        return () => {
          toRemove.forEach(({ eventType, listener }) => {
            // @ts-expect-error apparently you can't remove a custom listener to the window with TS
            window.removeEventListener(eventType, listener);
          });
        };
      }

      const removeNavigationListeners = createListeners('navigation', [
        'goto',
        'invalidate',
        'invalidateAll',
      ]);
      const removeFormsListeners = createListeners('forms', ['enhance']);
      window.addEventListener('click', globalClickListener);

      return () => {
        window.removeEventListener('click', globalClickListener);
        removeNavigationListeners();
        removeFormsListeners();
      };
    });

    return Story();
  },
];

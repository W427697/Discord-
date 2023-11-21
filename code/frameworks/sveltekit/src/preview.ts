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
        // we add a global click event listener and we check if there's a link in the composedPath
        const path = e.composedPath();
        const hasLink = path.findLast((el) => el instanceof HTMLElement && el.tagName === 'A');
        if (hasLink && hasLink instanceof HTMLAnchorElement) {
          // if it has a link we get the href of the link and we check over every provided href using the
          // key as a regex
          const to = hasLink.getAttribute('href');
          if (ctx?.parameters?.sveltekit?.hrefs && to) {
            Object.entries(ctx.parameters.sveltekit.hrefs).forEach(([link, override]) => {
              if (override instanceof Function) {
                const regex = new RegExp(link);
                if (regex.test(to)) {
                  // if the regex pass we call the function the user provided
                  override();
                }
              }
            });
          }
          e.preventDefault();
        }
      };

      /**
       * Function that create and add listeners for the event that are emitted by
       * the mocked functions. The event name is based on the function name
       *
       * eg. storybook:goto, storybook:invalidateAll
       * @param baseModule the base module where the function lives (navigation|forms)
       * @param functions the list of functions in that module that emit events
       * @returns a function to remove all the listener added
       */
      function createListeners(baseModule: string, functions: string[]) {
        // the array of every added listener, we can use this in the return function
        // to clean them
        const toRemove: Array<{
          eventType: string;
          listener: (event: { detail: any[] }) => void;
        }> = [];
        functions.forEach((func) => {
          // we loop over every function and check if the user actually passed
          // a function in sveltekit[baseModule][func] eg. sveltekit.navigation.goto
          if (
            ctx?.parameters?.sveltekit?.[baseModule]?.[func] &&
            ctx.parameters.sveltekit[baseModule][func] instanceof Function
          ) {
            // we create the listener that will just get the detail array from the custom element
            // and call the user provided function spreading this args in...this will basically call
            // the function that the user provide with the same arguments the function is invoked to

            // eg. if it calls goto("/my-route") inside the component the function sveltekit.navigation.goto
            // it provided to storybook will be called with "/my-route"
            const listener = ({ detail = [] as any[] }) => {
              const args = Array.isArray(detail) ? detail : [];
              ctx.parameters.sveltekit[baseModule][func](...args);
            };
            const eventType = `storybook:${func}`;
            toRemove.push({ eventType, listener });
            // add the listener to window
            // @ts-expect-error apparently you can't add a custom listener to the window with TS
            window.addEventListener(eventType, listener);
          }
        });
        return () => {
          // loop over every listener added and remove them
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

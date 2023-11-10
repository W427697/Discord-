<script>
	import { onMount } from 'svelte';

	/**
	 * @type {Parameters<(import("@storybook/svelte").Preview["decorators"] & {})[number]>[1]}
	 */
	export let ctx;
	onMount(() => {
		const globalClickListener = (/**@type {Event}*/ e) => {
			const path = e.composedPath();
			const hasLink = path.findLast((el) => el instanceof HTMLElement && el.tagName === 'A');
			if (hasLink && hasLink instanceof HTMLAnchorElement) {
				const to = hasLink.getAttribute('href');
				if (ctx?.parameters?.sveltekit?.linkOverrides && to) {
					for (const [link, override] of Object.entries(ctx.parameters.sveltekit.linkOverrides)) {
						if (override instanceof Function) {
							const regex = new RegExp(link);
							if (regex.test(to)) {
								override();
							}
						}
					}
				}
				e.preventDefault();
			}
		};

		function createListeners(baseModule, functions){
			const toRemove = [];
			for(let func of functions){
				if(ctx?.parameters?.sveltekit?.[baseModule]?.[func] && ctx.parameters.sveltekit[baseModule][func] instanceof Function){
					const listener = ({ detail = [] })=>{
						console.log("event", func, ctx);
						const args = Array.isArray(detail) ? detail : [];
						ctx.parameters.sveltekit[baseModule][func](...args);
					}
					const eventType = `storybook:${func}`;
					toRemove.push({ eventType, listener });
					window.addEventListener(eventType, listener);
				}
			}
			return ()=>{
				for(let { eventType, listener } of toRemove){
					window.removeEventListener(eventType, listener);
				}
			}
		}
		
		const removeNavigationListeners = createListeners("navigation", ["goto", "invalidate", "invalidateAll"])
		const removeFormsListeners = createListeners("forms", ["enhance"])
		window.addEventListener('click', globalClickListener);

		return () => {
			window.removeEventListener('click', globalClickListener);
			removeNavigationListeners();
			removeFormsListeners();
		};
	});
</script>

<slot />

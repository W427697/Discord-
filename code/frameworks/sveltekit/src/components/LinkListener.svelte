<script>
	import { onMount } from 'svelte';

	/**
	 * @type {Parameters<(import("@storybook/svelte").Preview["decorators"] & {})[number]>[1]}
	 */
	export let ctx;
	onMount(() => {
		const listener = (/**@type {Event}*/ e) => {
			const path = e.composedPath();
			const has_link = path.findLast((el) => el instanceof HTMLElement && el.tagName === 'A');
			if (has_link && has_link instanceof HTMLAnchorElement) {
				const to = has_link.getAttribute('href');
				let override_called = false;
				if (ctx?.parameters?.sveltekit?.linkOverrides && to) {
					for (const [link, override] of Object.entries(ctx.parameters.sveltekit.linkOverrides)) {
						if (override instanceof Function) {
							const regex = new RegExp(link);
							if (regex.test(to)) {
								override();
								override_called = true;
							}
						}
					}
				}
				if (!override_called) {
					// import('@storybook/addon-actions')
					// 	.then(({ action }) => {
					// 		action('sveltekit.navigation')();
					// 	})
					// 	.catch(console.log);
				}
				e.preventDefault();
			}
		};
		window.addEventListener('click', listener);
		return () => {
			window.removeEventListener('click', listener);
		};
	});
</script>

<slot />

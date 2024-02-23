/**
 * Turns an object into reactive props in Svelte 5.
 * Needs to be in a separate .svelte.js file to ensure Svelte
 * compiles it.
 * @template TProps
 * @param {TProps} data - The data to create Svelte 5 props from.
 * @returns {TProps} - The created Svelte 5 props.
 */
export const createSvelte5Props = (data) => {
  const props = $state(data);
  return props;
};

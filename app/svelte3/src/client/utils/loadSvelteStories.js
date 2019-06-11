/* global document */

import RegisterContext from '../components/RegisterContext.svelte';

const createFragment = document.createDocumentFragment
  ? () => document.createDocumentFragment()
  : () => document.createElement('div');

/**
 * This needs to be hooked in user's `loadStories`:
 *
 *     import { configure, loadSvelteStories } from '@storybook/svelte'
 *
 *     function loadStories() {
 *       const req = require.context('../src', true, /\.(stories|story)\.svelte$/)
 *       loadSvelteStories(req)
 *     }
 *
 *     configure(loadStories, module)
 */
const loadSvelteStories = req => {
  req.keys().forEach(filename => {
    try {
      const Stories = req(filename).default;
      const storyFn = () => Stories;
      const cmp = new RegisterContext({
        target: createFragment(),
        props: {
          Stories,
          register: { storyFn },
        },
      });
      cmp.$destroy();
    } catch (err) {
      // now what?
      // TODO find how to display this exception (all while we don't have
      // the stories' kind/names) -- meanwhile, don't hide it
      throw err;
    }
  });
};

export default loadSvelteStories;

import Centered from './Centered.svelte';

export default storyFn =>
  class extends Centered {
    constructor(opts) {
      super({ ...opts, props: { ...opts.props, Story: storyFn() } });
    }
  };

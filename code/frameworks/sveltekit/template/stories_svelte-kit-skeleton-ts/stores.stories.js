import Stores from './Stores.svelte';

export default {
  title: 'stories/sveltekit/modules/Stores',
  component: Stores,
  tags: ['autodocs'],
};

export const AllUndefined = {};

export const PageStore = {
  parameters: {
    sveltekit: {
      stores: {
        page: {
          data: {
            test: 'passed',
          },
        },
      },
    },
  },
};

export const NavigatingStore = {
  parameters: {
    sveltekit: {
      stores: {
        navigating: {
          route: {
            id: '/storybook',
          },
        },
      },
    },
  },
};

export const UpdatedStore = {
  parameters: {
    sveltekit: {
      stores: {
        updated: true,
      },
    },
  },
};

export const PageAndNavigatingStore = {
  parameters: {
    sveltekit: {
      stores: {
        page: {
          data: {
            test: 'passed',
          },
        },
        navigating: {
          route: {
            id: '/storybook',
          },
        },
      },
    },
  },
};

export const PageAndUpdatedStore = {
  parameters: {
    sveltekit: {
      stores: {
        page: {
          data: {
            test: 'passed',
          },
        },
        updated: true,
      },
    },
  },
};

export const NavigatingAndUpdatedStore = {
  parameters: {
    sveltekit: {
      stores: {
        navigating: {
          route: {
            id: '/storybook',
          },
        },
        updated: true,
      },
    },
  },
};

export const AllThreeStores = {
  parameters: {
    sveltekit: {
      stores: {
        page: {
          data: {
            test: 'passed',
          },
        },
        navigating: {
          route: {
            id: '/storybook',
          },
        },
        updated: true,
      },
    },
  },
};

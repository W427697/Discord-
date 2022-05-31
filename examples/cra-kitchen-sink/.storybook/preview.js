export const parameters = {
  options: {
    storySort: (a, b) =>
      a[1].title === b[1].title ? 0 : a[1].id.localeCompare(b[1].id, undefined, { numeric: true }),
  },
  docs: {
    source: {
      excludeDecorators: true,
    },
  },
};

export const parameters = {
  docs: {
    renderer: async () => {
      const { DocsRenderer } = await import('./blocks/DocsRenderer');
      return new DocsRenderer();
    },
  },
};

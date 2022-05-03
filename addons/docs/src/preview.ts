export const parameters = {
  docs: {
    renderer: async () => {
      const x = await import('./blocks/DocsRenderer');
      console.log(x);
      return x;
    },
  },
};

export const parameters: any = {
  docs: {
    getContainer: async () => (await import('./blocks')).DocsContainer,
    getPage: async () => (await import('./blocks')).DocsPage,
  },
};

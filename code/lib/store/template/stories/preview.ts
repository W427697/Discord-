export const parameters = {
  projectParameter: 'projectParameter',
  storyObject: {
    a: 'project',
    b: 'project',
    c: 'project',
  },
};

export const loaders = [
  async () => new Promise((r) => setTimeout(() => r({ projectValue: 2 }), 1000)),
];

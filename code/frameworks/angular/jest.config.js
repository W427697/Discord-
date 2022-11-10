module.exports = {
  displayName: 'frameworks/angular',
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  transformIgnorePatterns: ['/node_modules/(?!@angular|rxjs|nanoid|uuid)'],
  snapshotFormat: {
    escapeString: true,
    printBasicPrototype: true,
  },
};

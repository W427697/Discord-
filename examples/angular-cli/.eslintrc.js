const ignore = 0;

module.exports = {
  overrides: [
    {
      files: ['./src/stories/addon-jest.stories.ts'],
      rules: {
        '@typescript-eslint/ban-ts-comment': 'warn',
        'import/no-useless-path-segments': ignore,
      },
      settings: {
        'import/core-modules': ['../../addon-jest.testresults.json'],
      },
    },
  ],
};

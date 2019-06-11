module.exports = {
  extends: '../../.eslintrc.js',
  overrides: [
    {
      files: ['*.svelte'],
      plugins: ['svelte3'],
      rules: {
        'import/no-mutable-exports': 'off',
      },
    },
  ],
};

const { register } = require('esbuild-register/dist/node');

register({
  target: `node${process.version.slice(1)}`,
  format: 'cjs',
  hookIgnoreNodeModules: false,
  tsconfigRaw: `{
      "compilerOptions": {
        "strict": false,
        "skipLibCheck": true,
      },
    }`,
});

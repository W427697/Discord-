const { babelify } = require('./compile-babel');

babelify({
  watch: true,
  silent: false,
}).catch((e) => {
  console.error(e);
  process.exitCode = 1;
});

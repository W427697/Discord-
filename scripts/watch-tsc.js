const { tscfy } = require('./compile-tsc');

tscfy({
  watch: true,
  silent: false,
}).catch((e) => {
  console.error(e);
  process.exitCode = 1;
});

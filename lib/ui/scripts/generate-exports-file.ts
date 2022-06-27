// document = {};

console.log('Running...');

const r = async () => {
  const { values } = await import('../src/globals-runtime');
  console.log(values);
};

r().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});

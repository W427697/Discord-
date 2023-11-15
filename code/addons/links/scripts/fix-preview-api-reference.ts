import fs from 'fs-extra';

/* I wish this wasn't needed..
 * There seems to be some bug in tsup / the unlaying lib that does DTS bundling
 * ...that makes it mess up the generation.
 */
const run = async () => {
  const content = await fs.readFile('./dist/index.d.ts', 'utf-8');

  const regexp = /'lib\/preview-api/;
  const replaced = content.replace(regexp, "'@storybook/preview-api");

  await fs.writeFile('./dist/index.d.ts', replaced);
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});

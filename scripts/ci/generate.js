const { join } = require('path');
const fs = require('fs/promises');

async function run() {
  const input = join(__dirname, '..', '..', '.circleci', 'config.old.yml');
  const output = join(__dirname, '..', '..', '.circleci', 'config.generated.yml');

  const contents = await fs.readFile(input, 'utf8');
  await fs.writeFile(output, contents);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});

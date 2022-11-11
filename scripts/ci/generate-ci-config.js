const { join } = require('path');
const fs = require('fs/promises');

async function getAffectedPackages() {
  const contents = await fs.readFile(join(__dirname, '..', '..', 'code', 'affected.json'));
  const affectedJson = JSON.parse(contents);
  console.log({ affectedJson });
  return affectedJson.projects;
}

async function run() {
  const input = join(__dirname, '..', '..', '.circleci', 'config.base.yml');
  const output = join(__dirname, '..', '..', '.circleci', 'config.generated.yml');

  const contents = await fs.readFile(input, 'utf8');
  const affectedPackages = await getAffectedPackages();

  const final = contents
    .replace(/\${CI_PARALLELISM_CI}/g, affectedPackages.length)
    .replace(/\${CI_PARALLELISM_PR}/g, affectedPackages.length)
    .replace(/\${CI_PARALLELISM_MERGED}/g, affectedPackages.length);

  await fs.writeFile(output, final);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});

import { templatesByCadence } from '../code/lib/cli/src/sandbox-templates';

async function run() {
  console.log(JSON.stringify({ template: templatesByCadence.ci }));
}

if (require.main === module) {
  run().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

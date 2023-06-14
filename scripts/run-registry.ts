import program from 'commander';
import { run } from './run-verdaccio';

const logger = console;

program
  .option('-O, --open', 'keep process open')
  .option('-P, --publish', 'should publish packages');

program.parse(process.argv);

run({ open: !!program.open, publish: !!program.publish }).catch((e) => {
  logger.error(e);
  process.exit(1);
});

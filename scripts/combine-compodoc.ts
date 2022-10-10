import { join, resolve } from 'path';
import { tmpdir } from 'os';
import execa from 'execa';
import { realpath, readFile, writeFile, lstat } from 'fs-extra';
import glob from 'glob';

const logger = console;

// Find all symlinks in a directory. There may be more efficient ways to do this, but this works.
async function findSymlinks(dir: string) {
  const potentialDirs = await glob.sync(`${dir}/**/*/`);

  return (
    await Promise.all(
      potentialDirs.map(
        async (p) => [p, (await lstat(p.replace(/\/$/, ''))).isSymbolicLink()] as [string, boolean]
      )
    )
  )
    .filter(([, s]) => s)
    .map(([p]) => p);
}

async function run(cwd: string) {
  const dirs = [
    cwd,
    ...(await findSymlinks(resolve(cwd, './src'))),
    ...(await findSymlinks(resolve(cwd, './stories'))),
    ...(await findSymlinks(resolve(cwd, './template-stories'))),
  ];

  const docsArray: Record<string, any>[] = await Promise.all(
    dirs.map(async (dir) => {
      const outputDir = tmpdir();
      const resolvedDir = await realpath(dir);
      await execa.command(
        `yarn compodoc ${resolvedDir} -p ./tsconfig.json -e json -d ${outputDir}`,
        {
          cwd,
        }
      );
      const contents = await readFile(join(outputDir, 'documentation.json'), 'utf8');
      return JSON.parse(contents);
    })
  );

  // Compose together any array entries, discard anything else
  const documentation = docsArray.slice(1).reduce((acc, entry) => {
    return Object.fromEntries(
      Object.entries(acc).map(([key, accValue]) => {
        if (Array.isArray(accValue)) {
          return [key, [...accValue, ...entry[key]]];
        }
        return [key, accValue];
      })
    );
  }, docsArray[0]);

  await writeFile(join(cwd, 'documentation.json'), JSON.stringify(documentation));
}

if (require.main === module) {
  run(resolve(process.argv[2]))
    .then(() => process.exit(0))
    .catch((err) => {
      logger.error();
      logger.error(err);
      process.exit(1);
    });
}

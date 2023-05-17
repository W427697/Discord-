/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
import { readJson, writeJson } from 'fs-extra';
import chalk from 'chalk';
import path from 'path';
import program from 'commander';
import semver from 'semver';
import { z } from 'zod';
import { listOfPackages } from '../utils/list-packages';

program
  .name('version')
  .description('version all packages')
  .option('flags')
  .requiredOption(
    '-R, --release-type <major|minor|patch|prerelease>',
    'Which release type to use to bump the version'
  )
  .option(
    '-P, --pre-id <id>',
    'Which prerelease identifer to change to, eg. "alpha", "beta", "rc"'
  );

const optionsSchema = z
  .object({
    releaseType: z.enum([
      'major',
      'minor',
      'patch',
      'prerelease',
      'premajor',
      'preminor',
      'prepatch',
    ]),
    preId: z.string().optional(),
  })
  .refine((schema) => (schema.preId ? schema.releaseType.startsWith('pre') : true), {
    message:
      'Using prerelease identifier requires one of release types: premajor, preminor, prepatch, prerelease',
  });

type Options = {
  releaseType: semver.ReleaseType;
  preId?: string;
};

const validateOptions = (options: { [key: string]: any }): options is Options => {
  optionsSchema.parse(options);
  return true;
};

const getCurrentVersion = async () => {
  const { version } = await readJson(path.join(__dirname, '..', '..', 'code', 'package.json'));
  return version;
};

const bumpCodeVersion = async (nextVersion: string) => {
  console.log(`✍️ Bumping version of ${chalk.cyan('code')}'s package.json...`);

  const codePkgJsonPath = path.join(__dirname, '..', '..', 'code', 'package.json');
  const codePkgJson = await readJson(codePkgJsonPath);

  codePkgJson.version = nextVersion;
  await writeJson(codePkgJsonPath, codePkgJson, { spaces: 2 });

  console.log(`✅ Bumped version of ${chalk.cyan('code')}'s package.json`);
};
const bumpAllPackageVersions = async (currentVersion: string, nextVersion: string) => {
  console.log(`✍️ Bumping version of ${chalk.cyan('all packages')}...`);

  console.log(`✅ Bumped version of ${chalk.cyan('all packages')}`);
};

export const run = async (options: unknown) => {
  if (!validateOptions(options)) {
    return;
  }
  const { releaseType, preId } = options;

  console.log(`📈 Release type selected: ${chalk.green(releaseType)}`);
  if (preId) {
    console.log(`🆔 Version prerelease identifier selected: ${chalk.yellow(preId)}`);
  }
  console.log(`📐 Reading version of storybook`);
  console.log(`🚛 Listing storybook packages`);

  const [packages, currentVersion] = await Promise.all([listOfPackages(), getCurrentVersion()]);

  console.log(
    `📦 found ${packages.length} storybook packages at version ${chalk.blue(currentVersion)}`
  );

  const nextVersion = semver.inc(currentVersion, releaseType, preId);

  console.log(
    `⏭ Bumping version ${chalk.blue(currentVersion)} with release type ${chalk.green(releaseType)}${
      preId ? ` and ${chalk.yellow(preId)}` : ''
    } results in version: ${chalk.blue(nextVersion)}`
  );

  console.log(`⏭ Bumping all packages to ${chalk.blue(nextVersion)}...`);

  await bumpCodeVersion(nextVersion);
  await bumpAllPackageVersions(currentVersion, nextVersion);
};

if (require.main === module) {
  const options = program.parse().opts();
  run(options).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

// ------------
/** 

_updateRoot(getCurrentVersion, version);
_updateAllPeerDeps(/@storybook\/addon-(storyshots|actions)/, getCurrentVersion, version);
_updateVersions(getCurrentVersion, version);

function _updatePeerDeps(location, packageRegex, currentVersion, nextVersion) {
  const packagePath = path.join(location, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packagePath).toString());
  let updated = false;
  const hatCurrent = `^${currentVersion}`;
  const { peerDependencies } = packageJson;
  if (peerDependencies) {
    Object.keys(peerDependencies).forEach((dep) => {
      if (packageRegex.exec(dep)) {
        if (['*', nextVersion].includes(peerDependencies[dep])) {
          return;
        }
        if (![currentVersion, hatCurrent].includes(peerDependencies[dep])) {
          throw new Error(`Unexpected peer dep at ${packagePath}: ${dep}@${peerDependencies[dep]}`);
        }
        const next = currentVersion.startsWith('^') ? `^${nextVersion}` : nextVersion;
        console.log(`Updating peer dep at ${packagePath}: ${dep} => ${next}`);
        peerDependencies[dep] = next;
        updated = true;
      }
    });
    if (updated) {
      fs.writeFileSync(packagePath, `${JSON.stringify(packageJson, null, 2)}\n`);
    }
  }
}

function _updateRoot(currentVersion: string, nextVersion: string) {
  const json = JSON.parse(fs.readFileSync('./package.json').toString());
  json.version = nextVersion;
  fs.writeFileSync('./package.json', `${JSON.stringify(json, null, 2)}\n`);
}

function _updateAllPeerDeps(packageRegex: RegExp, currentVersion: string, nextVersion: string) {
  const locations = exec('yarn', 'lerna', 'list', '--long', '--json')
    .toString()
    .split('\n')
    .map((line) => {
      const match = /"location": "(.*)"/.exec(line);
      if (match) {
        return match[1];
      }
    })
    .filter(Boolean);
  locations.forEach((location) =>
    _updatePeerDeps(location, packageRegex, currentVersion, nextVersion)
  );
}

function _updateVersions(currentVersion: string, nextVersion: string) {
  const apiVersions = fs.existsSync('lib/api/src/version.ts')
    ? 'lib/api/src/version.ts'
    : 'lib/manager-api/src/version.ts';
  [apiVersions, 'lib/cli/src/versions.ts'].forEach((fname) => {
    const lines = fs.readFileSync(fname).toString().split('\n');
    const updated = lines.map((l) => l.replace(currentVersion, nextVersion));
    fs.writeFileSync(fname, updated.join('\n'));
  });
}

function _publishNew(npmTag: string, isManualVersion: boolean) {
  // NOTE: passing the version argument causes not all the packages to be published
  // WORKS: lerna publish patch [--options]
  // FAILS: lerna publish [--options] patch
  const version = npmTag === 'latest' ? 'patch' : 'prerelease';
  const versionArgs = isManualVersion ? [] : [version];
  const args = [
    '--exact',
    '--no-push',
    '--force-publish',
    `--dist-tag=${npmTag}`,
    '--no-git-reset',
    '--ignore-scripts',
  ];
  spawn('yarn', 'lerna', 'publish', ...versionArgs, ...args);
}
*/

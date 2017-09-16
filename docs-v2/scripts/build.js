/* eslint-disable no-console */
const exec = require('child_process').exec;
const fs = require('fs-extra');
const packageJson = require('../package.json');
const generateSitemap = require('./tasks/sitemap');

function handleProcessClose(build, resolve, reject, message) {
  build.on('close', code => (code === 0 ? resolve() : reject(new Error(message))));
}

const version = packageJson.version;
const prettifiedVersion = version.replace(/\./g, '-');
const outputDir = 'public';
const docsRepo = process.env.DOCS_REPO;

if (!docsRepo) {
  throw new Error('DOCS_REPO env parameter is no defined');
}

const sitemapReady = generateSitemap().then(() => console.log('🗺 ', 'Sitemap generated'));

/*
 * This script runs the command 'next build' in node production mode
 * If succesfull we proceed with 'next export'
 * We pipe all the output of the process directly into the output of this script's output
 */
Promise.all([sitemapReady])
  .then(() => fs.remove(outputDir))
  .then(
    () =>
      new Promise((resolve, reject) => {
        const build = exec(`git clone ${docsRepo} ./${outputDir} -v`);
        build.stdout.pipe(process.stdout);
        handleProcessClose(build, resolve, reject, '🛑 git-clone step failed');
      })
  )
  .then(
    () =>
      new Promise((resolve, reject) => {
        const build = exec('next build');
        build.stdout.pipe(process.stdout);
        handleProcessClose(build, resolve, reject, '🛑 build step failed');
      })
  )
  .then(() => fs.remove(`${outputDir}/_next`))
  .then(
    () =>
      new Promise((resolve, reject) => {
        const build = exec(`next export -o ${outputDir}/${prettifiedVersion}`);
        build.stdout.pipe(process.stdout);
        build.stderr.pipe(process.stdout);
        handleProcessClose(build, resolve, reject, '🛑 export to version step failed');
      })
  )
  .then(() => fs.copy(`${outputDir}/${prettifiedVersion}`, outputDir))
  .then(() => {
    const docsJsonPath = `${outputDir}/package.json`;
    return fs.readJson(docsJsonPath).then(docsJson => {
      // eslint-disable-next-line no-param-reassign
      docsJson.version = version;
      return fs.writeJson(docsJsonPath, docsJson, { spaces: 2 });
    });
  })
  .then(
    () =>
      new Promise((resolve, reject) => {
        const build = exec(`cd ${outputDir} && git add . -v`);
        build.stdout.pipe(process.stdout);
        handleProcessClose(build, resolve, reject, '🛑 git-add step failed');
      })
  )
  .then(
    () =>
      new Promise((resolve, reject) => {
        const build = exec(
          `cd ${outputDir} && git commit -a --message="Update docs version to ${version}" -v`
        );
        build.stdout.pipe(process.stdout);
        handleProcessClose(build, resolve, reject, '🛑 git-commit step failed');
      })
  )
  .then(
    () =>
      new Promise((resolve, reject) => {
        const build = exec(`cd ${outputDir} && git push -v`);
        build.stdout.pipe(process.stdout);
        handleProcessClose(build, resolve, reject, '🛑 git-push step failed');
      })
  )
  .then(() => fs.remove(outputDir))
  .catch(error => {
    // we wait a bit to let the stderr be printed
    setTimeout(() => console.log(error), 500);
  });

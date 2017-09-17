/* eslint-disable no-console */
const exec = require('child_process').exec;
const packageJson = require('../package.json');
const generateSitemap = require('./tasks/sitemap');
const gitCommands = require('./tasks/git_commands');
const nextCommands = require('./tasks/next_commands');
const staticDocsFs = require('./tasks/static_docs_fs');

const version = packageJson.version;
const prettyVersion = version.replace(/\./g, '-');
const outputDir = 'public';
const versionDir = `${outputDir}/${prettyVersion}`;
const docsRepo = process.env.DOCS_REPO;

if (!docsRepo) {
  throw new Error('DOCS_REPO env parameter is not defined');
}

function handleProcessClose(childProcess, resolve, reject, stepName) {
  childProcess.on(
    'close',
    code => (code === 0 ? resolve() : reject(new Error(`🛑 ${stepName} step failed`)))
  );
}

function promisifyProcess(command, step) {
  return new Promise((resolve, reject) => {
    const childProcess = exec(command);
    childProcess.stdout.pipe(process.stdout);
    childProcess.stderr.pipe(process.stdout);
    handleProcessClose(childProcess, resolve, reject, step);
  });
}

const sitemapReady = generateSitemap().then(() => console.log('🗺 ', 'Sitemap generated'));

Promise.all([sitemapReady])
  .then(() => staticDocsFs.deleteOutputDir(outputDir))
  .then(() => promisifyProcess(gitCommands.getGitClone(docsRepo, outputDir), 'git-clone'))
  .then(() => promisifyProcess(nextCommands.getNextBuild(prettyVersion), 'build'))
  .then(() => promisifyProcess(nextCommands.getNextExport(versionDir, prettyVersion), 'export'))
  .then(() => staticDocsFs.deleteNextOutputDir(outputDir))
  .then(() => staticDocsFs.overrideLatestVersion(versionDir, outputDir))
  .then(() => staticDocsFs.updatePackageJson(outputDir, version))
  .then(() => promisifyProcess(gitCommands.getGitAdd(outputDir), 'git-add'))
  .then(() => promisifyProcess(gitCommands.getGitCommit(outputDir, version), 'git-commit'))
  .then(() => promisifyProcess(gitCommands.getGitPush(outputDir), 'git-push'))
  .then(() => staticDocsFs.deleteOutputDir(outputDir))
  .catch(error => {
    // we wait a bit to let the stderr be printed
    setTimeout(() => console.log(error), 500);
  });

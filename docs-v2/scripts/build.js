/* eslint-disable no-console */
const exec = require('child_process').exec;
const packageJson = require('../package.json');
const generateSitemap = require('./tasks/sitemap');
const gitCommands = require('./tasks/git_commands');
const nextCommands = require('./tasks/next_commands');
const staticDocsFs = require('./tasks/static_docs_fs');

const version = packageJson.version;
const prettifiedVersion = version.replace(/\./g, '-');
const outputDir = 'public';
const outputVersionDir = `${outputDir}/${prettifiedVersion}`;
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

function promisifyChildProcess(command, step) {
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
  .then(() => promisifyChildProcess(gitCommands.getGitClone(docsRepo, outputDir), 'git-clone'))
  .then(() => promisifyChildProcess(nextCommands.getNextBuild(), 'build'))
  .then(() => promisifyChildProcess(nextCommands.getNextExport(outputVersionDir), 'export'))
  .then(() => staticDocsFs.deleteNextOutputDir(outputDir))
  .then(() => staticDocsFs.overrideLatestVersion(outputVersionDir, outputDir))
  .then(() => staticDocsFs.updatePackageJson(outputDir, version))
  .then(() => promisifyChildProcess(gitCommands.getGitAdd(outputDir), 'git-add'))
  .then(() => promisifyChildProcess(gitCommands.getGitCommit(outputDir, version), 'git-commit'))
  .then(() => promisifyChildProcess(gitCommands.getGitPush(outputDir), 'git-push'))
  .then(() => staticDocsFs.deleteOutputDir(outputDir))
  .catch(error => {
    // we wait a bit to let the stderr be printed
    setTimeout(() => console.log(error), 500);
  });

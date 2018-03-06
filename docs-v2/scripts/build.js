/* eslint-disable no-console */
const path = require('path');
const packageJson = require('../package.json');
const generateSitemap = require('./tasks/sitemap');
const gitCommands = require('./tasks/git_commands');
const nextCommands = require('./tasks/next_commands');
const staticDocsFs = require('./tasks/static_docs_fs');

const docsRepo = process.env.DOCS_REPO;

if (!docsRepo) {
  throw new Error('DOCS_REPO env parameter is not defined');
}

const { version } = packageJson;
const prettyVersion = version.replace(/\./g, '-');
const outputDir = 'public';
const versionDir = path.join(outputDir, prettyVersion);

const sitemapReady = generateSitemap().then(() => console.log('🗺 ', 'Sitemap generated'));

Promise.all([sitemapReady])
  .then(() => staticDocsFs.deleteOutputDir(outputDir))
  .then(() => gitCommands.configureUser())
  .then(() => gitCommands.clone(docsRepo, outputDir))
  .then(() => staticDocsFs.deleteOldFiles(outputDir, versionDir))
  .then(() => nextCommands.build())
  .then(() => nextCommands.staticExport(versionDir))
  .then(() => staticDocsFs.overrideLatestVersion(versionDir, outputDir))
  .then(() => staticDocsFs.storeFilesReference(versionDir))
  .then(() => staticDocsFs.deleteNextOutputDir(versionDir))
  .then(() => staticDocsFs.updatePackageJson(outputDir, version))
  .then(() => staticDocsFs.updateVersionsJson(outputDir, version))
  .then(() => gitCommands.add(outputDir))
  .then(() => gitCommands.commit(outputDir, version))
  .then(() => gitCommands.push(outputDir))
  .then(() => staticDocsFs.deleteOutputDir(outputDir))
  .catch(error => {
    // we wait a bit to let the stderr be printed
    setTimeout(() => console.log(error), 500);
  });

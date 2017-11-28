const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const path = require('path');

const unified = require('unified');
const remarkParse = require('remark-parse');
const mdHelpers = require('remark-helpers');
const detective = require('detective-es6');

const getJsPageTitle = require('./jsPageToTitle');

const parser = markdown =>
  unified()
    .use(remarkParse)
    .parse(markdown);

const findTitle = list =>
  // get first main heading and return plain text
  list.reduce(
    (acc, item) =>
      !acc && item.type === 'heading' && item.depth === 1 ? mdHelpers.text(item) : acc,
    ''
  );

function normalizePath(pathToNormalize) {
  // in windows paths are with the "\" separator,
  // we need to replace it with the "/" in order to support "next" routing
  return pathToNormalize.replace(/\\/, '/');
}

const createFile = (stat, fileName, workingDir, baseDir) => {
  const name = path.basename(fileName, path.extname(fileName));
  const routeFile = name.replace('index', '');
  const routeBase = normalizePath(workingDir.replace(baseDir, '')) || path.posix.sep;

  return (
    fs
      // read text from page.js
      .readFileAsync(path.join(workingDir, fileName), 'utf-8')
      // retrieve all require/imports
      .then(pageSource => detective(pageSource))
      // find the .md dependency
      .then(dependencies => dependencies.find(i => i.match(/.md$/)))
      // resolve the relative path
      .then(d => path.join(workingDir, d))
      // read the .md text
      .then(fpath => fs.readFileAsync(fpath, 'utf-8').then(data => ({ fpath, data })))
      // parse to abtract syntax tree
      .then(({ fpath, data }) => ({ fpath, mast: parser(data) }))
      // find the heading
      .then(({ fpath, mast }) => ({ fpath, title: findTitle(mast.children) }))
      // on any error, return "Index"
      .catch(() =>
        fs.readFileAsync(path.join(workingDir, fileName), 'utf-8').then(jsSource => ({
          fpath: path.join(workingDir, fileName),
          title: getJsPageTitle(jsSource),
        }))
      )
      .catch(() => ({
        fpath: path.join(workingDir, fileName),
        title: 'Index',
      }))
      .then(({ title, fpath }) => ({
        modified: stat.ctime,

        name,
        title,
        isFile: true,
        fpath: fpath || path.join(workingDir, fileName),
        route: path.posix.join(routeBase, routeFile),
      }))
  );
};

const createDirectory = (items, localWorkingDir, baseDir) => ({
  route: normalizePath(localWorkingDir.replace(baseDir, '')),
  length: items.length,
  files: items,
});

const readDir = (workingDir, baseDir) =>
  fs
    .readdirAsync(workingDir)
    .filter(n => !n.match(/^[._]/))
    .map(fileName =>
      fs.statAsync(path.join(workingDir, fileName)).then(stat => {
        if (stat.isFile()) {
          return createFile(stat, fileName, workingDir, baseDir);
        }
        if (stat.isDirectory()) {
          const localWorkingDir = path.join(workingDir, fileName);
          return readDir(localWorkingDir, baseDir).then(items =>
            createDirectory(items, localWorkingDir, baseDir)
          );
        }
        return undefined;
      })
    );

module.exports = readDir;

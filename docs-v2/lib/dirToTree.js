const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const path = require('path');

const unified = require('unified');
const remarkParse = require('remark-parse');
const mdHelpers = require('remark-helpers');

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

const createFile = (stat, fileName, workingDir, baseDir) => {
  const name = path.basename(fileName, path.extname(fileName));
  const routeFile = name.replace('index', '');
  const routeBase = workingDir.replace(baseDir, '').replace(/\\/, '/') || path.posix.sep;

  return fs
    .readFileAsync(
      path.join(workingDir.replace('pages', 'content'), fileName.replace(/.jsx?$/, '.md')),
      'utf-8'
    )
    .then(fileData => parser(fileData))
    .then(mast => findTitle(mast.children))
    .catch(() => 'Index')
    .then(title => ({
      modified: stat.ctime,

      name,
      title,
      isFile: true,
      route: path.posix.join(routeBase, routeFile),
    }));
};

const createDirectory = (items, localWorkingDir, baseDir) => ({
  route: localWorkingDir.replace(baseDir, '').replace(/\\/, '/'),
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

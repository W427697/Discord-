const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const path = require('path');

function File(stat, fileName, workingDir, baseDir) {
  const name = path.basename(fileName, path.extname(fileName));
  const routeFile = name.replace('index', '');
  const routeBase = workingDir.replace(baseDir, '') || path.sep;

  this.size = stat.size;
  this.modified = stat.ctime;
  this.created = stat.birthtime;

  this.name = name;
  this.isFile = true;
  this.route = path.join(routeBase, routeFile);
}

function Directory(items, localWorkingDir, baseDir) {
  this.route = localWorkingDir.replace(baseDir, '');
  this.length = items.length;
  this.files = items;
}

const readDir = (workingDir, baseDir) =>
  fs.readdirAsync(workingDir).filter(n => !n.match(/^[._]/)).map(fileName =>
    fs.statAsync(path.join(workingDir, fileName)).then(stat => {
      if (stat.isFile()) {
        return new File(stat, fileName, workingDir, baseDir);
      }
      if (stat.isDirectory()) {
        const localWorkingDir = path.join(workingDir, fileName);
        return readDir(localWorkingDir, baseDir).then(
          items => new Directory(items, localWorkingDir, baseDir)
        );
      }
      return undefined;
    })
  );

module.exports = readDir;

const promisifyProcess = require('./promisifyProcess');

function configureUser() {
  return promisifyProcess(
    'git config --global user.email "storybookbot@gmail.com" && git config --global user.name "storybookbot"',
    'git-config'
  );
}

function clone(docsRepo, outputDir) {
  return promisifyProcess(`git clone ${docsRepo} ./${outputDir}`, 'git-clone');
}

function add(outputDir) {
  return promisifyProcess(`cd ${outputDir} && git add --all -v`, 'git-add');
}

function commit(outputDir, version) {
  return promisifyProcess(
    `cd ${outputDir} && git commit -a --message="Update docs version to ${version}"`,
    'git-commit'
  );
}

function push(outputDir) {
  return promisifyProcess(`cd ${outputDir} && git push`, 'git-push');
}

module.exports = {
  configureUser,
  clone,
  add,
  commit,
  push,
};

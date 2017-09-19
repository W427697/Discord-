function getGitUserConfig() {
  return 'git config --global user.email "storybookbot@gmail.com" && git config --global user.name "storybookbot"';
}

function getGitClone(docsRepo, outputDir) {
  return `git clone ${docsRepo} ./${outputDir}`;
}

function getGitAdd(outputDir) {
  return `cd ${outputDir} && git add --all -v`;
}

function getGitCommit(outputDir, version) {
  return `cd ${outputDir} && git commit -a --message="Update docs version to ${version}"`;
}

function getGitPush(outputDir) {
  return `cd ${outputDir} && git push`;
}

module.exports = {
  getGitUserConfig,
  getGitClone,
  getGitAdd,
  getGitCommit,
  getGitPush,
};

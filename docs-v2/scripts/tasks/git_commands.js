function getGitClone(docsRepo, outputDir) {
  return `git clone ${docsRepo} ./${outputDir}`;
}

function getGitAdd(outputDir) {
  return `cd ${outputDir} && git add .`;
}

function getGitCommit(outputDir, version) {
  return `cd ${outputDir} && git commit -a --message="Update docs version to ${version}"`;
}

function getGitPush(outputDir) {
  return `cd ${outputDir} && git push`;
}

module.exports = {
  getGitClone,
  getGitAdd,
  getGitCommit,
  getGitPush,
};

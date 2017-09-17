function getGitClone(docsRepo, outputDir) {
  return `git clone ${docsRepo} ./${outputDir} -v`;
}

function getGitAdd(outputDir) {
  return `cd ${outputDir} && git add . -v`;
}

function getGitCommit(outputDir, version) {
  return `cd ${outputDir} && git commit -a --message="Update docs version to ${version}" -v`;
}

function getGitPush(outputDir) {
  return `cd ${outputDir} && git push -v`;
}

module.exports = {
  getGitClone,
  getGitAdd,
  getGitCommit,
  getGitPush,
};

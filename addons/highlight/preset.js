function config(entry = []) {
  return [...entry, require.resolve('./dist/esm/highlight')];
}

function managerEntries(entry = []) {
  return entry;
}

module.exports = {
  managerEntries,
  config,
};

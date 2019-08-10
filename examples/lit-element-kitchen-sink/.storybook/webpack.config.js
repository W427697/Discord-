module.exports = async ({ config }) => {
  config.module.rules[0].include.push(/node_modules(?:\/|\\)lit-element|lit-html/);
  return config;
};

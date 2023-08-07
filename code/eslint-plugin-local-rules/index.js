// Local eslint plugins to be used in the monorepo and help maintainers keep certain code standards.

/* eslint-disable global-require */
module.exports = {
  rules: {
    'no-uncategorized-errors': require('./no-uncategorized-errors'),
    'no-duplicated-error-codes': require('./no-duplicated-error-codes'),
  },
};

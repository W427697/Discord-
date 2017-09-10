const fs = require('fs');
const packageJson = require('../package.json');

if (process.argv.length < 3) {
  throw new Error('wrong number of arguments');
}

const domain = process.argv[2];
const version = packageJson.version;

const prettifiedVersion = version.replace(/\./g, '-');

const nowConfig = {
  name: 'storybook',
  alias: [domain, `latest.${domain}`, `v${prettifiedVersion}.${domain}`],
};

fs.writeFileSync('now.json', JSON.stringify(nowConfig, null, '\t'));

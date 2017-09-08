const fs = require('fs');
const lernaJson = require('../../lerna.json');

const version = lernaJson.version;
if (process.argv.length < 3) {
  throw new Error('wrong number of arguments');
}

const domain = process.argv[2];

const prettifiedVersion = version.replace(/\./g, '-');

const nowConfig = {
  name: 'storybook',
  alias: [domain, `latest.${domain}`, `v${prettifiedVersion}.${domain}`],
};

fs.writeFileSync('now.json', JSON.stringify(nowConfig, null, '\t'));

const fs = require('fs');
const lernaJson = require('../../lerna.json');

const domain = 'storypuke.tk';
const version = lernaJson.version;

const prettifiedVersion = version.replace(/\./g, '-');

const nowConfig = {
  name: 'storybook',
  alias: [domain, `latest.${domain}`, `v${prettifiedVersion}.${domain}`],
};

fs.writeFileSync('now.json', JSON.stringify(nowConfig, null, '\t'));

const fs = require('fs');

const domain = 'storypuke.tk';
const version = '3.2.9';

const prettifiedVersion = version.replace(/\./g, '-');

const nowConfig = {
  name: 'storybook',
  alias: [domain, `latest.${domain}`, `v${prettifiedVersion}.${domain}`],
};

fs.writeFileSync('now.json', JSON.stringify(nowConfig, null, '\t'));

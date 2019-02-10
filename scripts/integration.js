/* eslint-disable no-console */
/* eslint-disable no-undef */

const childProcess = require('child_process');
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const program = require('commander');

program.option('-e, --example [type]', 'which example to test').parse(process.argv);

const StaticServer = require('static-server');

const { example } = program;

if (!fs.existsSync(path.join(__dirname, '..', 'examples', example))) {
  throw new Error('no example defined or example folder does not exist');
}

const port = '8081';
childProcess.execSync(`
  echo "building ${example}"
  pushd examples/${example}
  yarn build-storybook --quiet
  popd
`);

const server = new Promise((res, rej) => {
  const s = new StaticServer({
    port,
    rootPath: path.join(__dirname, '..', 'examples', example, 'storybook-static'),
  });
  s.start(err => {
    if (err) {
      rej(err);
    } else {
      res(s);
    }
  });
});

server
  .then(async () => {
    // eslint-disable-next-line global-require
    const puppeteer = require('puppeteer');

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(`http://localhost:${port}`, { waitUntil: 'networkidle2' });

    // TEST wether a story was rendered
    const storyWasRendered = await page.evaluate(
      () =>
        !!document
          .getElementById('storybook-preview-iframe')
          .contentDocument.querySelector('#root *')
    );
    assert.equal(storyWasRendered, true);

    // TEST wether the expected addons are present in the manager
    // TODO: we want to find all types of addons, not just the panels
    const foundAddons = await page.evaluate(() =>
      [
        ...document
          .getElementById('storybook-panel-root')
          .querySelectorAll('[role="tablist"] > button'),
      ].map(i => i.innerText)
    );
    assert.deepEqual(foundAddons, ['Actions', 'Events', 'Knobs', 'Accessibility', 'Tests']);

    // TEST wether stories are present in the manager
    const foundStories = await page.evaluate(() =>
      [...document.getElementById('storybook-manager-explorer').querySelectorAll('[id]')].map(
        i => i.innerText
      )
    );
    assert.equal(foundStories.length > 0, true);

    await browser.close();
  })
  .then(() => {
    server.then(s => {
      console.log('all good, closing...');
      s.stop();
    });
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

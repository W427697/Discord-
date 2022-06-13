import { logger } from '@storybook/node-logger';
import betterOpn from 'better-opn'; // betterOpn alias used because also loading open
import open from 'open';
import defaultBrowser from 'default-browser';
import dedent from 'ts-dedent';

const chromiumBrowsers = [
  'com.google.chrome',
  'com.google.chrome.canary',
  'com.microsoft.edge',
  'com.microsoft.edgemac',
  'com.microsoft.edgemac.beta',
  'com.operasoftware.opera',
  'com.brave.browser',
  'com.brave.browser.beta',
  'com.brave.browser.dev',
  'org.blisk.blisk',
  'com.vivaldi.vivaldi',
];

const isChromium = (browserId: string) => {
  return chromiumBrowsers.includes(browserId.toLowerCase());
};

export async function openInBrowser(address: string) {
  try {
    const res = await defaultBrowser();
    if (res && isChromium(res.id)) {
      // We use betterOpn for Chrome because it is better at handling which chrome tab
      // or window the preview loads in.
      betterOpn(address);
    } else {
      await open(address);
    }
  } catch (error) {
    logger.error(dedent`
      Could not open ${address} inside a browser. If you're running this command inside a
      docker container or on a CI, you need to pass the '--ci' flag to prevent opening a
      browser by default.
    `);
  }
}

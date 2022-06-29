import { logger } from '@storybook/node-logger';
import betterOpn from 'better-opn'; // betterOpn alias used because also loading open
import open from 'open';
import dedent from 'ts-dedent';

export async function openInBrowser(address: string) {
  const getDefaultBrowser = (await import('default-browser')).default;
  const defaultBrowser = await getDefaultBrowser();
  try {
    if (defaultBrowser.name === 'Chrome' || defaultBrowser.name === 'Chromium') {
      betterOpn(address);
    } else await open(address);
  } catch (error) {
    logger.error(dedent`
        Could not open ${address} inside a browser. If you're running this command inside a
        docker container or on a CI, you need to pass the '--ci' flag to prevent opening a
        browser by default.
      `);
  }
}

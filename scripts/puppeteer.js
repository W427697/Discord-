/* eslint-disable import/no-extraneous-dependencies */
import puppeteer from 'puppeteer';

console.log('hello');

async function run() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto('https://github.com');
  await page.screenshot({ path: 'screenshots/github.png' });

  browser.close();
}

run();

const pAll = require('p-all');
const { toMatchImageSnapshot } = require('jest-image-snapshot');

expect.extend({ toMatchImageSnapshot });

const renderScreenshot = async (url) => {
  const page = await global.browser.newPage();
  page.on('dialog', async (dialog) => {
    await dialog.dismiss();
  });
  await page.goto(url);
  const data = await page.screenshot({ fullPage: true });
  await page.close();
  return data;
};

const renderStories = async (stories) => {
  const screenshotTasks = stories.map((story) => async () => {
    console.log(`Rendering screenshot for story "${story.name}"`);
    const image = await renderScreenshot(`${process.env.STORYBOOK_URL}/iframe.html?id=${story.id}`);
    return { ...story, image };
  });

  const storyshots = await pAll(screenshotTasks, {
    concurrency: Number(process.env.CONCURRENCY),
  });

  return storyshots;
};

describe('Storyshots', () => {
  let storyshots;

  const stories = global.stories;

  beforeAll(async () => {
    storyshots = await renderStories(stories);
  }, 120000);

  stories.forEach((story) => {
    test(`Snapshot ${story.name}`, () => {
      const { image } = storyshots.find(({ id }) => id === story.id);
      console.log({ image });
      expect(image).toMatchImageSnapshot();
    });
  });
});

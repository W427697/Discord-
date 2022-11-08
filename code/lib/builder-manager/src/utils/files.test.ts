import { platform } from 'os';
import { sanitizePath } from './files';

const os = platform();

if (os !== 'win32') {
  test('sanitizePath', () => {
    const addonsDir = '/Users/username/Projects/projectname/storybook';
    const text = 'demo text';
    const file = {
      path: '/Users/username/Projects/projectname/storybook/node_modules/@storybook/addon-x+y/dist/manager.mjs',
      contents: Uint8Array.from(Array.from(text).map((letter) => letter.charCodeAt(0))),
      text,
    };
    const { location, url } = sanitizePath(file, addonsDir);

    expect(location).toMatchInlineSnapshot(
      `"/Users/username/Projects/projectname/storybook/node_modules/@storybook/addon-x+y/dist/manager.mjs"`
    );
    expect(url).toMatchInlineSnapshot(
      `"./sb-addons/node_modules/%40storybook/addon-x%2By/dist/manager.mjs"`
    );
  });
}

if (os === 'win32') {
  test('sanitizePath - 1', () => {
    const addonsDir = 'C:\\Users\\username\\Projects\\projectname\\storybook';
    const text = 'demo text';
    const file = {
      path: 'C:\\Users\\username\\Projects\\projectname\\storybook\\node_modules\\@storybook\\addon-x+y\\dist\\manager.mjs',
      contents: Uint8Array.from(Array.from(text).map((letter) => letter.charCodeAt(0))),
      text,
    };
    const { location, url } = sanitizePath(file, addonsDir);

    expect(location).toMatchInlineSnapshot(
      `"C:\\\\Users\\\\username\\\\Projects\\\\projectname\\\\storybook\\\\node_modules\\\\@storybook\\\\addon-x+y\\\\dist\\\\manager.mjs"`
    );
    expect(url).toMatchInlineSnapshot(
      `"./sb-addons/node_modules/%40storybook/addon-x%2By/dist/manager.mjs"`
    );
  });
}

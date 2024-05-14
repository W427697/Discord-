```js filename="storybook.test.js" renderer="common" language="js" tabTitle="jest"
import path from 'path';
import * as glob from 'glob';

//👇 Augment expect with jest-specific-snapshot
import 'jest-specific-snapshot';

import { describe, test, expect } from '@jest/globals';

// Replace your-testing-library with one of the supported testing libraries (e.g., react, vue)
import { render } from '@testing-library/your-testing-library';

// Adjust the import based on the supported framework or Storybook's testing libraries (e.g., react, vue3)
import { composeStories } from '@storybook/your-framework';

const compose = (entry) => {
  try {
    return composeStories(entry);
  } catch (e) {
    throw new Error(
      `There was an issue composing stories for the module: ${JSON.stringify(entry)}, ${e}`,
    );
  }
};

function getAllStoryFiles() {
  // Place the glob you want to match your stories files
  const storyFiles = glob.sync(
    path.join(__dirname, 'stories/**/*.{stories,story}.{js,jsx,mjs,ts,tsx}'),
  );

  return storyFiles.map((filePath) => {
    const storyFile = require(filePath);
    const storyDir = path.dirname(filePath);
    const componentName = path.basename(filePath).replace(/\.(stories|story)\.[^/.]+$/, '');

    return { filePath, storyFile, storyDir, componentName };
  });
}

describe('Stories Snapshots', () => {
  getAllStoryFiles().forEach(({ storyFile, componentName }) => {
    const meta = storyFile.default;
    const title = meta.title || componentName;

    describe(title, () => {
      const stories = Object.entries(compose(storyFile)).map(([name, story]) => ({ name, story }));

      if (stories.length <= 0) {
        throw new Error(
          `No stories found for this module: ${title}. Make sure there is at least one valid story for this module.`,
        );
      }

      stories.forEach(({ name, story }) => {
        test(name, async () => {
          const mounted = render(story());
          // Ensures a consistent snapshot by waiting for the component to render by adding a delay of 1 ms before taking the snapshot.
          await new Promise((resolve) => setTimeout(resolve, 1));
          // Defines the custom snapshot path location and file name
          const customSnapshotPath = `./__snapshots__/${componentName}.test.js.snap`;
          expect(mounted.container).toMatchSpecificSnapshot(customSnapshotPath);
        });
      });
    });
  });
});
```

```ts filename="storybook.test.ts" renderer="common" language="ts" tabTitle="jest"
// Replace your-framework with one of the supported Storybook frameworks (react, vue3)
import type { Meta, StoryFn } from '@storybook/your-framework';

import path from "path";
import * as glob from "glob";

//👇 Augment expect with jest-specific-snapshot
import "jest-specific-snapshot";

import { describe, test, expect } from "@jest/globals";

// Replace your-testing-library with one of the supported testing libraries (e.g., react, vue)
import { render } from '@testing-library/your-testing-library';

// Adjust the import based on the supported framework or Storybook's testing libraries (e.g., react, vue3)
import { composeStories } from '@storybook/your-framework';

type StoryFile = {
  default: Meta;
  [name: string]: StoryFn | Meta;
};

const compose = (
  entry: StoryFile
): ReturnType<typeof composeStories<StoryFile>> => {
  try {
    return composeStories(entry);
  } catch (e) {
    throw new Error(
      `There was an issue composing stories for the module: ${JSON.stringify(entry)}, ${e}`
    );
  }
};

function getAllStoryFiles() {
  // Place the glob you want to match your stories files
  const storyFiles = glob.sync(
    path.join(__dirname, 'stories/**/*.{stories,story}.{js,jsx,mjs,ts,tsx}'),
  );

  return storyFiles.map((filePath) => {
    const storyFile = require(filePath);
    const storyDir = path.dirname(filePath);
    const componentName = path
      .basename(filePath)
      .replace(/\.(stories|story)\.[^/.]+$/, "");

    return { filePath, storyFile, storyDir, componentName };
  });
}

describe("Stories Snapshots", () => {
  getAllStoryFiles().forEach(({ storyFile, componentName }) => {
    const meta = storyFile.default;
    const title = meta.title || componentName;

    describe(title, () => {
      const stories = Object.entries(compose(storyFile)).map(
        ([name, story]) => ({ name, story })
      );

      if (stories.length <= 0) {
        throw new Error(
          `No stories found for this module: ${title}. Make sure there is at least one valid story for this module.`
        );
      }

      stories.forEach(({ name, story }) => {
        test(name, async () => {
          const mounted = render(story());
          // Ensures a consistent snapshot by waiting for the component to render by adding a delay of 1 ms before taking the snapshot.
          await new Promise((resolve) => setTimeout(resolve, 1));
          // Defines the custom snapshot path location and file name
          const customSnapshotPath = `./__snapshots__/${componentName}.test.ts.snap`;
          expect(mounted.container).toMatchSpecificSnapshot(customSnapshotPath);
      });
    });
  });
});
```

```js filename="storybook.test.js" renderer="common" language="js" tabTitle="jest"
import path from 'path';
import * as glob from 'glob';

import { describe, test, expect } from '@jest/globals';

// Replace your-testing-library with one of the supported testing libraries (e.g., react, vue)
import { render } from '@testing-library/your-testing-library';

// Adjust the import based on the supported framework or Storybook's testing libraries (e.g., react, vue3)
import { composeStories } from '@storybook/your-framework';

const compose = (entry) => {
  try {
    return composeStories(entry);
  } catch (e) {
    throw new Error(
      `There was an issue composing stories for the module: ${JSON.stringify(entry)}, ${e}`,
    );
  }
};

function getAllStoryFiles() {
  // Place the glob you want to match your stories files
  const storyFiles = glob.sync(
    path.join(__dirname, 'stories/**/*.{stories,story}.{js,jsx,mjs,ts,tsx}'),
  );

  return storyFiles.map((filePath) => {
    const storyFile = require(filePath);
    const storyDir = path.dirname(filePath);
    const componentName = path.basename(filePath).replace(/\.(stories|story)\.[^/.]+$/, '');

    return { filePath, storyFile, storyDir, componentName };
  });
}

describe('Stories Snapshots', () => {
  getAllStoryFiles().forEach(({ storyFile, componentName }) => {
    const meta = storyFile.default;
    const title = meta.title || componentName;

    describe(title, () => {
      const stories = Object.entries(compose(storyFile)).map(([name, story]) => ({ name, story }));

      if (stories.length <= 0) {
        throw new Error(
          `No stories found for this module: ${title}. Make sure there is at least one valid story for this module.`,
        );
      }

      stories.forEach(({ name, story }) => {
        test(name, async () => {
          const mounted = render(story());
          // Ensures a consistent snapshot by waiting for the component to render by adding a delay of 1 ms before taking the snapshot.
          await new Promise((resolve) => setTimeout(resolve, 1));
          expect(mounted.container).toMatchSnapshot();
        });
      });
    });
  });
});
```

```ts filename="storybook.test.ts" renderer="common" language="ts" tabTitle="jest"
// Replace your-framework with one of the supported Storybook frameworks (react, vue3)
import type { Meta, StoryFn } from '@storybook/your-framework';

import path from 'path';
import * as glob from 'glob';

import { describe, test, expect } from '@jest/globals';

// Replace your-testing-library with one of the supported testing libraries (e.g., react, vue)
import { render } from '@testing-library/your-testing-library';

// Adjust the import based on the supported framework or Storybook's testing libraries (e.g., react, vue3)
import { composeStories } from '@storybook/your-framework';

type StoryFile = {
  default: Meta;
  [name: string]: StoryFn | Meta;
};

const compose = (entry: StoryFile): ReturnType<typeof composeStories<StoryFile>> => {
  try {
    return composeStories(entry);
  } catch (e) {
    throw new Error(
      `There was an issue composing stories for the module: ${JSON.stringify(entry)}, ${e}`,
    );
  }
};

function getAllStoryFiles() {
  // Place the glob you want to match your stories files
  const storyFiles = glob.sync(
    path.join(__dirname, 'stories/**/*.{stories,story}.{js,jsx,mjs,ts,tsx}'),
  );

  return storyFiles.map((filePath) => {
    const storyFile = require(filePath);
    const storyDir = path.dirname(filePath);
    const componentName = path.basename(filePath).replace(/\.(stories|story)\.[^/.]+$/, '');

    return { filePath, storyFile, storyDir, componentName };
  });
}

describe('Stories Snapshots', () => {
  getAllStoryFiles().forEach(({ storyFile, componentName }) => {
    const meta = storyFile.default;
    const title = meta.title || componentName;

    describe(title, () => {
      const stories = Object.entries(compose(storyFile)).map(([name, story]) => ({ name, story }));

      if (stories.length <= 0) {
        throw new Error(
          `No stories found for this module: ${title}. Make sure there is at least one valid story for this module.`,
        );
      }

      stories.forEach(({ name, story }) => {
        test(name, async () => {
          const mounted = render(story());
          // Ensures a consistent snapshot by waiting for the component to render by adding a delay of 1 ms before taking the snapshot.
          await new Promise((resolve) => setTimeout(resolve, 1));
          expect(mounted.container).toMatchSnapshot();
        });
      });
    });
  });
});
```

```js filename="test/Button.test.js|ts" renderer="react" language="js" tabTitle="jest"
import { render } from '@testing-library/react';

import { composeStories } from '@storybook/react';

import * as stories from '../stories/Button.stories';

const { Primary } = composeStories(stories);
test('Button snapshot', async () => {
  const mounted = render(<Primary />);
  expect(mounted.container).toMatchSnapshot();
});
```

```json renderer="vue" language="js" tabTitle="jest"
{
  "scripts": {
    "test": "jest --setupFiles ./setupFile.js"
  }
}
```

```json renderer="vue" language="ts" tabTitle="jest"
{
  "scripts": {
    "test": "jest --setupFiles ./setupFile.js"
  }
}
```


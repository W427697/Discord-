```js filename="Form.test.js|jsx" renderer="react" language="js" tabTitle="compose-stories"
import { composeStories } from '@storybook/react';

import * as FormStories from './LoginForm.stories';

const { ValidForm } = composeStories(FormStories, {
  decorators: [
    // Define your story-level decorators here
  ],
  globalTypes: {
    // Define your global types here
  },
  parameters: {
    // Define your story-level parameters here
  },
});
```

```ts filename="Form.test.ts|tsx" renderer="react" language="ts" tabTitle="compose-stories"
import { composeStories } from '@storybook/react';

import * as FormStories from './LoginForm.stories';

const { ValidForm } = composeStories(FormStories, {
  decorators: [
    // Define your story-level decorators here
  ],
  globalTypes: {
    // Define your global types here
  },
  parameters: {
    // Define your story-level parameters here
  },
});
```

```js filename="tests/Form.test.js" renderer="vue" language="js" tabTitle="compose-stories-3"
import { composeStory } from '@storybook/vue3';

import * as FormStories from './LoginForm.stories';

const { ValidForm } = composeStories(FormStories, {
  decorators: [
    // Define your story-level decorators here
  ],
  globalTypes: {
    // Define your global types here
  },
  parameters: {
    // Define your story-level parameters here
  },
});
```

```ts filename="tests/Form.test.ts" renderer="vue" language="ts" tabTitle="compose-stories-3"
import { composeStory } from '@storybook/vue3';

import * as FormStories from './LoginForm.stories';

const { ValidForm } = composeStories(FormStories, {
  decorators: [
    // Define your story-level decorators here
  ],
  globalTypes: {
    // Define your global types here
  },
  parameters: {
    // Define your story-level parameters here
  },
});
```


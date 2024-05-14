```js filename="Form.test.js|jsx" renderer="react" language="js" tabTitle="compose-story"
import { composeStory } from '@storybook/react';

import Meta, { ValidForm as ValidFormStory } from './LoginForm.stories';

const FormValidation = composeStory(ValidFormStory, Meta, {
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

```ts filename="Form.test.ts|tsx" renderer="react" language="ts" tabTitle="compose-story"
import { composeStory } from '@storybook/react';

import Meta, { ValidForm as ValidFormStory } from './LoginForm.stories';

const FormValidation = composeStory(ValidFormStory, Meta, {
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

```js filename="tests/Form.test.js" renderer="vue" language="js" tabTitle="compose-story-3"
import { composeStory } from '@storybook/vue3';

import Meta, { ValidForm as ValidFormStory } from './LoginForm.stories';

const FormValidation = composeStory(ValidFormStory, Meta, {
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

```ts filename="tests/Form.test.ts" renderer="vue" language="ts" tabTitle="compose-story-3"
import { composeStory } from '@storybook/vue3';

import Meta, { ValidForm as ValidFormStory } from './LoginForm.stories';

const FormValidation = composeStory(ValidFormStory, Meta, {
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


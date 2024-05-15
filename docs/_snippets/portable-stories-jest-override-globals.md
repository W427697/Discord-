```tsx filename="Button.test.tsx" renderer="react" language="ts"
import { test } from '@jest/globals';
import { render } from '@testing-library/react';
// 👉 Using Next.js? Import from @storybook/nextjs instead
import { composeStory } from '@storybook/react';

import meta, { Primary } from './Button.stories';

test('renders in English', async () => {
  const PrimaryStory = composeStory(
    Primary,
    meta,
    { globals: { locale: 'en' } }, // 👈 Project annotations to override the locale
  );

  render(<PrimaryStory />);
});

test('renders in Spanish', async () => {
  const PrimaryStory = composeStory(Primary, meta, { globals: { locale: 'es' } });

  render(<PrimaryStory />);
});
```

```ts filename="Button.test.ts" renderer="vue" language="ts"
import { test } from '@jest/globals';
import { render } from '@testing-library/vue';
import { composeStory } from '@storybook/vue3';

import meta, { Primary } from './Button.stories';

test('renders in English', async () => {
  const PrimaryStory = composeStory(
    Primary,
    meta,
    { globals: { locale: 'en' } }, // 👈 Project annotations to override the locale
  );

  render(PrimaryStory);
});

test('renders in Spanish', async () => {
  const PrimaryStory = composeStory(Primary, meta, { globals: { locale: 'es' } });

  render(PrimaryStory);
});
```


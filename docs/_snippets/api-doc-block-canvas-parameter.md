```ts filename="Button.stories.ts" renderer="angular" language="ts"
import type { Meta, StoryObj } from '@storybook/angular';

import { Button } from './button.component';

const meta: Meta<Button> = {
  component: Button,
};

export default meta;
type Story = StoryObj<Button>;

export const Basic: Story = {
  parameters: {
    docs: {
      canvas: { sourceState: 'shown' },
    },
  },
};
```

```js filename="Button.stories.js|jsx" renderer="common" language="js"
export const Basic {
  parameters: {
    docs: {
      canvas: { sourceState: 'shown' },
    },
  },
};
```

```ts filename="Button.stories.ts|tsx" renderer="common" language="ts-4-9"
// Replace your-framework with the name of your framework
import type { Meta, StoryObj } from '@storybook/your-framework';

import { Button } from './Button';

const meta = {
  component: Button,
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  parameters: {
    docs: {
      canvas: { sourceState: 'shown' },
    },
  },
};
```

```ts filename="Button.stories.ts|tsx" renderer="common" language="ts"
// Replace your-framework with the name of your framework
import type { Meta, StoryObj } from '@storybook/your-framework';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Basic: Story = {
  parameters: {
    docs: {
      canvas: { sourceState: 'shown' },
    },
  },
};
```

```js filename="Button.stories.js" renderer="web-components" language="js"
export default {
  title: 'Button',
  component: 'demo-button',
};

export const Basic = {
  parameters: {
    docs: {
      canvas: { sourceState: 'shown' },
    },
  },
};
```

```ts filename="Button.stories.ts" renderer="web-components" language="ts"
import type { Meta, StoryObj } from '@storybook/web-components';

const meta: Meta = {
  title: 'Button',
  component: 'demo-button',
};

export default meta;
type Story = StoryObj;

export const Basic: Story = {
  parameters: {
    docs: {
      canvas: { sourceState: 'shown' },
    },
  },
};
```


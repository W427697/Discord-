```js filename=".storybook/main.js" renderer="react" language="js"
export default {
  // ...
  // framework: '@storybook/react-webpack5', 👈 Remove this
  framework: '@storybook/nextjs', // 👈 Add this
};
```

```ts filename=".storybook/main.ts" renderer="react" language="ts"
import { StorybookConfig } from '@storybook/nextjs';

const config: StorybookConfig = {
  // ...
  // framework: '@storybook/react-webpack5', 👈 Remove this
  framework: '@storybook/nextjs', // 👈 Add this
};

export default config;
```


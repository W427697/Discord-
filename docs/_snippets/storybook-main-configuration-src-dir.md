```js filename="./storybook/main.js" renderer="common" language="js" tabTitle="main-js"
export default {
  // Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
  framework: '@storybook/your-framework',
  stories: ['../src'],
};
```

```ts filename=".storybook/main.ts" renderer="common" language="ts" tabTitle="main-ts"
// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';

const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src'],
};

export default config;
```


```js filename=".storybook/main.js" renderer="web-components" language="js"
export default {
  // ...
  // framework: '@storybook/react-webpack5', 👈 Remove this
  framework: '@storybook/nextjs', // 👈 Add this
};
```

```ts filename=".storybook/main.ts" renderer="web-components" language="ts"
import { StorybookConfig } from '@storybook/web-components-webpack5';

const config: StorybookConfig = {
  // ...
  framework: '@storybook/web-components-webpack5', // 👈 Add this
};

export default config;
```


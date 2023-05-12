---
title: 'config.previewAnnotations'
---

Type: `string[] | ((config: string[], options: Options) => string[] | Promise<string[]>)`

Add additional scripts to run in the story preview.

<div class="aside">

💡 Mostly used by [addons](../addons/writing-presets.md) and [frameworks](../contribute/framework.md#previewjs-example). Storybook users should likely add scripts to [`preview.js`](../configure/overview.md#configure-story-rendering) instead.

</div>

```ts
// @storybook/nextjs framework's src/preset.ts

import type { StorybookConfig } from './types';

export const previewAnnotations: StorybookConfig['previewAnnotations'] = (entry = []) => [
  ...entry,
  require.resolve('@storybook/nextjs/preview.js'),
];
```

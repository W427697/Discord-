# Storybook for Vue 3

Storybook for Vue 3 is a UI development environment for your Vue components.
With it, you can visualize different states of your UI components and develop them interactively.

![Storybook Screenshot](https://github.com/storybookjs/storybook/blob/master/media/storybook-intro.gif)

Storybook runs outside of your app.
So you can develop UI components in isolation without worrying about app specific dependencies and requirements.

## Getting Started

```sh
cd my-vue-app
npx -p @storybook/cli sb init
```

For more information visit: [storybook.js.org](https://storybook.js.org)

---

Storybook also comes with a lot of [addons](https://storybook.js.org/docs/vue/configure/storybook-addons) and a great API to customize as you wish.
You can also build a [static version](https://storybook.js.org/docs/vue/workflows/publish-storybook) of your storybook and deploy it anywhere you want.

## Extending Vue Application

- When using global custom components or extension (e.g `app.use`). You will need to do the following example in `./storybook/preview.js`.

```js
// .storybook/preview.js

import { app } from '@storybook/vue3'

app.use(MyPlugin)
app.component(MyComponent)
app.mixin({ /* My mixin */ })

// export const ...

```

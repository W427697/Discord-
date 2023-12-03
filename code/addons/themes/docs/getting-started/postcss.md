# 🏁 Getting started with `postcss`

## 📦 Install addon

<!-- **NOTE:** As of Storybook 7.2, `@storybook/addon-themes` ships in `@storybook/addon-essentials`. If you're using Storybook >= 7.2, skip to ["Import your css"](#🥾-import-your-css). -->

To get started, **install the package** as a dev dependency

yarn:

```zsh
yarn add -D @storybook/addon-themes postcss-dark-theme-class
```

npm:

```zsh
npm install -D @storybook/addon-themes postcss-dark-theme-class
```

pnpm:

```zsh
pnpm add -D @storybook/addon-themes postcss-dark-theme-class
```

## 🧩 Register Addon

Now, **include the addon** in your `.storybook/main.js` file.

```diff
module.exports = {
  stories: [
    "../stories/**/*.stories.mdx",
    "../stories/**/*.stories.@(js|jsx|ts|tsx)",
  ],
  addons: [
    "@storybook/addon-essentials",
+   "@storybook/addon-themes"
  ],
};
```

## 🥾 Import your CSS

To give your stories access to styles, import them into your `.storybook/preview.js` file.

```diff
import { Preview } from "@storybook/your-renderer";

+import "../src/index.css";

const preview: Preview = {
  parameters: { /* ... */ },
};

export default preview;
```

## 🎨 Provide your theme(s)

Tailwind supports light and dark color modes out of the box. These modes can be activated by setting a `.dark` class on a parent element.

To enable switching between these modes in a click for your stories, use our `withThemeByClassName` decorator by adding the following code to your `.storybook/preview.js` file.

```diff
-import { Preview } from "@storybook/your-renderer";
+import { Preview, Renderer } from "@storybook/your-renderer";
+import { withThemeByClassName } from "@storybook/addon-themes";

import "../src/index.css";


const preview: Preview = {
  parameters: { /* ... */ },
+ decorators: [
+  withThemeByClassName<Renderer>({
+    themes: {
+      light: "is-light",
+      dark: "is-dark",
+    },
+    defaultTheme: "light",
+  }),
+ ]
};

export default preview;
```

## 🏷️ Add class to `prefers-color-scheme` media

Check your project for existing PostCSS config: postcss.config.js in the project root, "postcss" section in package.json or postcss in bundle config.

Add plugin to the list.

```diff
module.exports = {
  plugins: [
+   require('postcss-dark-theme-class'),
    require('autoprefixer')
  ]
}
```

Use `prefers-color-scheme` media in your CSS:

```css
:root {
  --text-color: black;
}
@media (prefers-color-scheme: dark) {
  html {
    --text-color: white
  }
}
```
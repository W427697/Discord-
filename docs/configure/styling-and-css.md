---
title: 'Styling and CSS'
---

There are many ways to include CSS in a web application, and correspondingly there are many ways to include CSS in Storybook. Usually, it is best to try and replicate what your application does with styling in Storybook’s configuration. To make this easier, we recommend using [`@storybook/addon-styling`](https://github.com/storybookjs/addon-styling).

### CSS-in-JS

CSS-in-JS libraries are designed to use basic JavaScript, and they often work in Storybook without any extra configuration. Some libraries expect components to render in a specific rendering “context” (for example, to provide themes), which can be accomplished with `@storybook/addon-styling`'s [`withThemeFromJSXProvider` decorator](https://github.com/storybookjs/addon-styling/blob/next/docs/api.md#withthemefromjsxprovider).

### Importing CSS files

To add global CSS for all of your stories, import it in [`.storybook/preview.js`](./overview.md#configure-story-rendering).

```js
// .storybook/preview.js

import '../src/styles/global.css';
```

If your component files import their CSS, Storybook's webpack configuration will work out of the box. The noticeable exception to this is if you're using a CSS compiler tools like Sass or Postcss.

### CSS compilers

If you're using tools like Sass or Postcss, you can either install and configure [`@storybook/addon-styling`](https://github.com/storybookjs/addon-styling#storybookaddon-styling), or customize [Storybook's webpack configuration](../builders/webpack.md#extending-storybooks-webpack-config) and include the appropriate loader. If you're using Vite, this all comes pre-configured for you.

<FeatureSnippets paths={['configure/css-troubleshooting/angular.mdx']} />

### Adding webfonts

If you need webfonts to be available, you may need to add some code to the [`.storybook/preview-head.html`](./story-rendering.md#adding-to-head) file. We recommend including any assets with your Storybook if possible, in which case you likely want to configure the [static file location](./images-and-assets.md#serving-static-files-via-storybook-configuration).

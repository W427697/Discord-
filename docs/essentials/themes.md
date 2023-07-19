---
title: 'Themes'
---

Storybook's [Themes](https://github.com/storybookjs/storybook/tree/next/code/addons/themes) addon allows you to switch between multiple themes for your components inside of the preview in [Storybook](https://storybook.js.org).

![Switching between themes in Storybook](./addon-themes-example.gif)

## Theme decorators

To make your themes accessible to your stories, `@storybook/addon-themes` exposes three [decorators](https://storybook.js.org/docs/react/writing-stories/decorators) for different methods of theming

### JSX providers

For libraries that expose themes to components through providers, such as [Material UI](https://storybook.js.org/recipes/@mui/material/), [Styled-components](https://storybook.js.org/recipes/styled-components/), and [Emotion](https://storybook.js.org/recipes/@emotion/styled/), use the `withThemeFromJSXProvider`.

```ts
// .storybook/preview.ts
import type { Renderer } from '@storybook/your-framework'
import { withThemeFromJSXProvider } from '@storybook/addon-themes';

import { createGlobalStyle, ThemeProvider } from 'styled-components';
import { lightTheme, darkTheme } from '../src/themes';

/* snipped for brevity */

export const decorators = [
  withThemeFromJSXProvider<Renderer>({
  themes: {
    light: lightTheme,
    dark: darkTheme,
  }
  defaultTheme: 'light',
  Provider: ThemeProvider,
  GlobalStyles,
})];
```

### CSS classes

For libraries that rely on CSS classes on a parent element to determine the theme, you can use the `withThemeByClassName` decorator.

```ts
// .storybook/preview.ts
import type { Renderer } from '@storybook/your-framework';
import { withThemeByClassName } from '@storybook/addon-themes';

import '../src/index.css';

/* snipped for brevity */

export const decorators = [
  withThemeByClassName<Renderer>({
    themes: {
      light: '',
      dark: 'dark',
    },
    defaultTheme: 'light',
  }),
];
```

### Data attributes

For libraries that rely on data attributes on a parent element to determine the theme, you can use the `withThemeByDataAttribute` decorator.

```ts
// .storybook/preview.ts
import type { Renderer } from '@storybook/your-framework';
import { withThemeByDataAttribute } from '@storybook/addon-themes';

import '../src/index.css';

/* snipped for brevity */

export const decorators = [
  withThemeByDataAttribute<Renderer>({
    themes: {
      light: 'light',
      dark: 'dark',
    },
    defaultTheme: 'light',
    attributeName: 'data-bs-theme',
  }),
];
```

## DIY decorator

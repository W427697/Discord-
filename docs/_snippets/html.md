```html renderer="common" language="ts" tabTitle="html"
{/* .storybook/manager-head.html */}

<meta name="description" content="Components for my awesome project" key="desc" />
```

```html renderer="common" language="ts" tabTitle="html"
{/* .storybook/manager-head.html */}

<meta name="robots" content="noindex" />
```

```html renderer="common" language="ts" tabTitle="html"
{/*  .storybook/preview-body.html */}

<div id="custom-root"></div>
```

```html renderer="common" language="ts" tabTitle="html"
{/* .storybook/preview-body.html */}

<style>
  html {
    font-size: 15px;
  }
</style>
```

```html renderer="common" language="ts" tabTitle="html"
{/* .storybook/preview-head.html */}

{/* Pull in static files served from your Static directory or the internet */}
{/* Example: `main.js|ts` is configured with staticDirs: ['../public'] and your font is located in the `fonts` directory inside your `public` directory */}
<link rel="preload" href="/fonts/my-font.woff2" />

{/* Or you can load custom head-tag JavaScript: */}

<script src="https://use.typekit.net/xxxyyy.js"></script>
<script>
  try {
    Typekit.load();
  } catch (e) {}
</script>
```

```html renderer="common" language="ts" tabTitle="html"
{/* .storybook/preview-head.html */}

{/* Loads a font from a CDN */}
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap"
  rel="stylesheet"
/>
{/* Load your CSS file */}
<link rel="stylesheet" href="path/to/your/styles.css" />
```

```html renderer="common" language="ts" tabTitle="html"
{/* .storybook/preview-head.html */}

<script>
  window.global = window;
</script>
```


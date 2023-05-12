---
title: 'config.previewMainTemplate'
---

Type: `string`

Default: See example below

Override the preview's main page template, with a reference to a file containing an `.ejs` template that will be interpolated with environment variables.

Here's an example demonstrating the default template, which you can copy and customize:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/main-config-preview-main-template.js.mdx',
    'common/main-config-preview-main-template.ts.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

```html
<!-- .storybook/previewMainTemplate.ejs -->

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title><%= htmlWebpackPlugin.options.title || 'Storybook'%></title>

    <% if (htmlWebpackPlugin.files.favicon) { %>
    <link rel="shortcut icon" href="<%= htmlWebpackPlugin.files.favicon%>" />
    <% } %>

    <meta name="viewport" content="width=device-width, initial-scale=1" />

    <link
      rel="prefetch"
      href="./sb-common-assets/nunito-sans-regular.woff2"
      as="font"
      type="font/woff2"
      crossorigin
    />
    <link
      rel="prefetch"
      href="./sb-common-assets/nunito-sans-italic.woff2"
      as="font"
      type="font/woff2"
      crossorigin
    />
    <link
      rel="prefetch"
      href="./sb-common-assets/nunito-sans-bold.woff2"
      as="font"
      type="font/woff2"
      crossorigin
    />
    <link
      rel="prefetch"
      href="./sb-common-assets/nunito-sans-bold-italic.woff2"
      as="font"
      type="font/woff2"
      crossorigin
    />
    <link rel="stylesheet" href="./sb-common-assets/fonts.css" />

    <% if (typeof headHtmlSnippet !== 'undefined') { %> <%= headHtmlSnippet %> <% } %> <%
    htmlWebpackPlugin.files.css.forEach(file => { %>
    <link href="<%= file %>" rel="stylesheet" />
    <% }); %>

    <style>
      #storybook-root[hidden],
      #storybook-docs[hidden] {
        display: none !important;
      }
    </style>
  </head>
  <body>
    <% if (typeof bodyHtmlSnippet !== 'undefined') { %> <%= bodyHtmlSnippet %> <% } %>

    <div id="storybook-root"></div>
    <div id="storybook-docs"></div>

    <% if (typeof globals !== 'undefined' && Object.keys(globals).length) { %>
    <script>
      <% for (var varName in globals) { %>
          <% if (globals[varName] != undefined) { %>
            window['<%=varName%>'] = <%= JSON.stringify(globals[varName]) %>;
          <% } %>
      <% } %>
    </script>
    <% } %>
    <script type="module">
      import './sb-preview/runtime.js';

      <% htmlWebpackPlugin.files.js.forEach(file => { %>
      import './<%= file %>';
      <% }); %>
    </script>
  </body>
</html>
```

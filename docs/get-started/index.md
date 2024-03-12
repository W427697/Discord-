---
title: Get started with Storybook
hideRendererSelector: true
---

<!-- prettier-ignore-start -->

export const RightArrow = () => (
  <svg
    viewBox="0 0 14 14"
    width="10px"
    height="16px"
    style={{
      marginLeft: '4px',
      display: 'inline-block',
      shapeRendering: 'inherit',
      verticalAlign: 'middle',
      fill: 'currentColor',
      'path fill': 'currentColor',
      transform: 'translateY(-1px)',
    }}
  >
    <path d="m11.1 7.35-5.5 5.5a.5.5 0 0 1-.7-.7L10.04 7 4.9 1.85a.5.5 0 1 1 .7-.7l5.5 5.5c.2.2.2.5 0 .7Z" />
  </svg>
);

<!-- prettier-ignore-end -->

Welcome to Storybook's documentation ✦ Learn how to get started with Storybook in your project. Then explore the main concepts and additional resources to help you grow and maintain your Storybook.

## What is Storybook?

Storybook is a frontend workshop for building UI components and pages in isolation. It helps you develop and share hard-to-reach states and edge cases without needing to run your whole app. Thousands of teams use it for UI development, testing, and documentation. It's open source and free.

## Install Storybook

Storybook is a standalone tool that runs alongside your app. It's a zero-config environment that works with any modern frontend framework. You can install Storybook into an existing project or create a new one from scratch.

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
   'common/init-command.npx.js.mdx',
   'common/init-command.yarn.js.mdx',
   'common/init-command.pnpm.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

Want to know more about the installation process? Check out the [installation guide](./install.md).

Storybook works with many frontend tools. Choose your framework to get started and learn more.

<div class="sb-grid two-up">
  <a href="./nextjs/?renderer=react" class="sb-grid-item card media">
    <img src="./logo-nextjs.svg" width="28" height="28" alt="" class="img" />
    <h3>Next.js</h3>
    <p>Next.js is a React framework for building full-stack web applications.</p>
  </a>
  <a href="./react-vite/?renderer=react" class="sb-grid-item card media">
    <img src="./logo-react.svg" width="28" height="28" alt="" class="img" />
    <h3>React + Vite</h3>
    <p>React is the library for web and native user interfaces. Vite is a build tool that aims to provide a faster and leaner development experience for modern web projects.</p>
  </a>
  <a href="./react-webpack5/?renderer=react" class="sb-grid-item card media">
    <img src="./logo-react.svg" width="28" height="28" alt="" class="img" />
    <h3>React + Webpack</h3>
    <p>React is the library for web and native user interfaces. Webpack is a static module bundler for modern JavaScript applications.</p>
  </a>
  <a href="https://github.com/storybookjs/react-native" target="_blank" class="sb-grid-item card media">
    <img src="./logo-react.svg" width="28" height="28" alt="" class="img" />
    <h3>React Native</h3>
    <p>React Native combines the best parts of native development with React, a best-in-class JavaScript library for building user interfaces.</p>
  </a>
  <a href="./vue-vite/?renderer=vue" class="sb-grid-item card media">
    <img src="./logo-vue.svg" width="28" height="28" alt="" class="img" />
    <h3>Vue + Vite</h3>
    <p>Vue is an approachable, performant, and versatile framework for building web user interfaces. Vite is a build tool that aims to provide a faster and leaner development experience for modern web projects.</p>
  </a>
  <a href="./vue-webpack5/?renderer=vue" class="sb-grid-item card media">
    <img src="./logo-vue.svg" width="28" height="28" alt="" class="img" />
    <h3>Vue + Webpack</h3>
    <p>Vue is an approachable, performant, and versatile framework for building web user interfaces. Webpack is a static module bundler for modern JavaScript applications.</p>
  </a>
  <a href="./angular/?renderer=angular" class="sb-grid-item card media">
    <img src="./logo-angular.svg" width="28" height="28" alt="" class="img" />
    <h3>Angular</h3>
    <p>Angular is a development platform, built on TypeScript.</p>
  </a>
  <a href="./sveltekit/?renderer=svelte" class="sb-grid-item card media">
    <img src="./logo-svelte.svg" width="28" height="28" alt="" class="img" />
    <h3>SvelteKit</h3>
    <p>SvelteKit is a framework for rapidly developing robust, performant web applications using Svelte.</p>
  </a>
  <a href="./svelte-vite/?renderer=svelte" class="sb-grid-item card media">
    <img src="./logo-svelte.svg" width="28" height="28" alt="" class="img" />
    <h3>Svelte + Vite</h3>
    <p>Svelte is a front-end, open-source JavaScript framework for making interactive webpages. Vite is a build tool that aims to provide a faster and leaner development experience for modern web projects.</p>
  </a>
  <a href="./svelte-webpack5/?renderer=svelte" class="sb-grid-item card media">
    <img src="./logo-svelte.svg" width="28" height="28" alt="" class="img" />
    <h3>Svelte + Webpack</h3>
    <p>Svelte is a front-end, open-source JavaScript framework for making interactive webpages. Webpack is a static module bundler for modern JavaScript applications.</p>
  </a>
  <a href="./web-components-vite/?renderer=web-components" class="sb-grid-item card media">
    <img src="./logo-web-components.svg" width="28" height="28" alt="" class="img" />
    <h3>Web components + Vite</h3>
    <p>Web components are a set of web platform APIs that allow you to create new custom, reusable, encapsulated HTML tags to use in web pages and web apps. Vite is a build tool that aims to provide a faster and leaner development experience for modern web projects.</p>
  </a>
  <a href="./web-components-webpack5/?renderer=web-components" class="sb-grid-item card media">
    <img src="./logo-web-components.svg" width="28" height="28" alt="" class="img" />
    <h3>Web components + Webpack</h3>
    <p>Web components are a set of web platform APIs that allow you to create new custom, reusable, encapsulated HTML tags to use in web pages and web apps. Webpack is a static module bundler for modern JavaScript applications.</p>
  </a>
</div>

## Main concepts

Storybook is a powerful tool that can help you with many aspects of your UI development workflow. Here are some of the main concepts to get you started.

<div class="sb-grid two-up">
  <a href="../writing-stories/index.md" class="sb-grid-item card card-large media media-title-only">
    <img src="./icon-story.svg" alt="" width="20" height="20" class="img" />
    <h3>Stories</h3>
    <p>A story captures the rendered state of a UI component. Each component can have multiple stories which describe all the "interesting" states that component supports.</p>
  </a>
  <a href="../writing-docs/index.md" class="sb-grid-item card card-large media media-title-only">
    <img src="./icon-docs.svg" alt="" width="20" height="20" class="img" />
    <h3>Docs</h3>
    <p>Storybook automatically creates documentation for your components using your stories. That allows you to create UI library usage guidelines, design system sites, and more.</p>
  </a>
  <a href="../writing-tests/index.md" class="sb-grid-item card card-large media media-title-only">
    <img src="./icon-testing.svg" alt="" width="20" height="20" class="img" />
    <h3>Testing</h3>
    <p>Stories are a pragmatic starting point for your UI testing strategy. You already write stories as a natural part of UI development, testing those stories is a low-effort way to prevent UI bugs over time.</p>
  </a>
  <a href="../sharing/index.md" class="sb-grid-item card card-large media media-title-only">
    <img src="./icon-sharing.svg" alt="" width="20" height="20" class="img" />
    <h3>Sharing</h3>
    <p>Publishing your Storybook allows you to share your work with others. It can also be embedded in other places like Notion or Figma.</p>
  </a>
</div>

## Additional resources

Once you've got the basics down, you can explore these other ways to get the most out of Storybook.

<div class="sb-grid three-up">
  <a href="../essentials/index.md" class="sb-grid-item media">
    <img src="./icon-more.svg" width="28" height="28" alt="" class="img" />
    Essential addons
  </a>
  <a href="https://storybook.js.org/integrations/" class="sb-grid-item media">
    <img src="./icon-more.svg" width="28" height="28" alt="" class="img" />
    Addon catalog
  </a>
  <a href="https://storybook.js.org/integrations/" class="sb-grid-item media">
    <img src="./icon-more.svg" width="28" height="28" alt="" class="img" />
    Recipes
  </a>
  <a href="../builders/index.md" class="sb-grid-item media">
    <img src="./icon-more.svg" width="28" height="28" alt="" class="img" />
    Builders
  </a>
  <a href="../contribute/index.md" class="sb-grid-item media">
    <img src="./icon-more.svg" width="28" height="28" alt="" class="img" />
    How to contribute
  </a>
  <a href="../migration-guide/index.md" class="sb-grid-item media">
    <img src="./icon-more.svg" width="28" height="28" alt="" class="img" />
    Migrate to 8.0
  </a>
  <a href="../faq.md" class="sb-grid-item media">
    <img src="./icon-more.svg" width="28" height="28" alt="" class="img" />
    FAQ
  </a>
</div>

---

<div class="sb-grid two-up">
  <div class="sb-grid-item">
    <h3>Need some help?</h3>
    <p><a href="https://github.com/storybookjs/storybook/discussions/categories/help">Join a discussion on GitHub<RightArrow /></a></p>
  </div>
  <div class="sb-grid-item">
    <h3>Latest product updates</h3>
    <p><a href="https://storybook.js.org/releases/">See changelog<RightArrow /></a></p>
  </div>
</div>

<style>
  {`
    .sb-grid {
      display: grid;
      gap: 16px;
    }

    .sb-grid.two-up {
      grid-template-columns: repeat(2, 1fr);
    }

    .sb-grid.three-up {
      grid-template-columns: repeat(3, 1fr);
    }
    
    .sb-grid.four-up {
      grid-template-columns: repeat(4, 1fr);
    }

    a.sb-grid-item.sb-grid-item.sb-grid-item {
      color: inherit;
      text-decoration: none;
    }

    .card {
      border-radius: 6px;
      border: 1px solid #D9E8F2;
      padding: 12px;
      transition: border-color 0.2s ease;
    }

    .card:hover {
      border-color: #B2C3CD;
    }

    .card h3 {
      font-size: 16px;
      font-weight: 600;
      line-height: 28px;
      margin: 0;
    }

    .card p {
      font-size: 14px;
      line-height: 24px;
      margin: 0;
    }

    .card.card-large {
      padding: 24px 28px;
    }

    .card.card-large h3 {
      font-size: 18px;
      font-weight: 700;
    }

    .media.media.media {
      display: grid;
    }

    .media {
      grid-template-columns: auto 1fr;
      grid-template-rows: auto 1fr;
      gap: 0 12px;
    }

    .media .img {
      align-self: baseline;
    }

    .media:not(.media-title-only) .img {
      grid-row: span 2;
    }

    .media-title-only {
      row-gap: 12px;
    }

    .media-title-only .img {
      margin-top: 4px;
    }

    .media-title-only p {
      grid-column: span 2;
    }
  `}
</style>

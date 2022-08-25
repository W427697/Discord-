# Manager-Builder

Do not use this package unless you know what you are doing.
Storybook uses this package internally to create the manager side of storybook.

This package uses `esbuild` to bundle the manager-side of addons, and prepare it for modern ESM supporting browsers.

Each addon is bundled into a separate file, and the manager is responsible for loading them.
In addition, if `manager.*` exists, it's also bundled, and loaded.

Additionally this package also will add the manager ui via the `@storybook/ui` package, which is already build by `esbuild` in our build process before publishing.

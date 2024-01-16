---
title: Addon migration guide for Storybook 8.0
---

We deeply appreciate the dedication and effort addon creators put into keeping the Storybook ecosystem vibrant and up-to-date. As Storybook evolves to version 8.0, bringing new features and improvements, this guide is here to assist you in migrating your addons from 7.x to 8.0. If you need to migrate your addon from an earlier version of Storybook, please first refer to the [Addon migration guide for Storybook 7.0](https://storybook.js.org/docs/addons/addon-migration-guide).

## Updating Dependencies

Begin by updating your Storybook dependencies. Use the `next` tag for pre-release versions, `latest` for the most recent stable release, or specify the version directly.

```json
{
  "dependencies": {
    "@storybook/client-logger": "next" // or "latest", or "^8.0.0"
  }
}
```

## Key Changes for Addons

Here are the essential changes in version 8.0 that impact addon development. Please check the [full migration note](https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#from-version-7x-to-800) for an exhaustive list of changes in 8.0.

### React 18 for Manager UI

UI injected into panels, tools, etc. by addons is now rendered with React 18. Also note that the `key` prop is no longer passed to the render function.

```tsx
import { addons, types } from '@storybook/manager-api';

addons.register('my-addon', () => {
  addons.add('my-addon/panel', {
    type: types.PANEL,
    title: 'My Addon',
    // This will be called as a JSX element by react 18
    render: ({ active }) => (active ? <div>Hello World</div> : null),
  });
});
```

### @storybook/components Deprecations

`Icons` component from `@storybook/components` is now deprecated in favor of [`@storybook/icons`](https://github.com/storybookjs/icons). Additionally, various `Button` component props are also deprecated, with alternatives provided.

### Storybook Layout State API Changes

If you're customizing the Storybook UI configuration with `addons.setConfig({...})`, be aware of these changes to the layout state:

- `showNav: boolean` is now `navSize: number`, where the number represents the size of the sidebar in pixels.
- `showPanel: boolean` is now split into `bottomPanelHeight: number` and `rightPanelWidth: number`, where the numbers represents the size of the panel in pixels.
- `isFullscreen: boolean` is removed, but can be achieved by setting a combination of the above.

### Removal of Deprecated Features

Deprecated packages and APIs from 7.0 are now removed in 8.0. Consult the [full migration notes](https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#deprecations-which-are-now-removed) for details.

## Releasing

For Storybook 8.0 compatibility, release a new major version of your addon. If maintaining support for 7.x, consider releasing minor or patch versions.

We also recommend releasing your own addon using the `next` tag to test it out in projects.

## Support

If you're still having issues with your addon after following this guide, please open a [new discussion](https://github.com/storybookjs/storybook/discussions/new?category=help) in our GitHub repository.

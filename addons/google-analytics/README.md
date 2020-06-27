# Storybook Google Analytics Addon

Storybook Addon Google Analytics can be used to support google analytics in [Storybook](https://storybook.js.org).

[Framework Support](https://github.com/storybookjs/storybook/blob/master/ADDONS_SUPPORT.md)

## Installation

Install the following npm module:

```sh
npm i --save-dev @storybook/addon-google-analytics
```

or with yarn:

```sh
yarn add -D @storybook/addon-google-analytics
```

within `.storybook/main.js`:

```js
module.exports = {
  addons: ['@storybook/addon-google-analytics']
}
```

## Basic configuration

The analytics addon is configured by story parameters with the `analytics` key.  To configure globally, import `addParameters` from your app layer in your `preview.js` file.

```js
import { addParameters } from '@storybook/client-api';

addParameters({
  analytics: {
    reactGAId: 'UA-000000-01',
    reactGAOptions: {},
  },
});
```

## Advanced configuration

The analytics addon gives complete control over what `Storybook events` are logged to Google Analytics.
This can be configured using the `events` parameter, which is a map of key-value pairs denoting what storybook events should be tracked and under what circumstances.


### Excluding events from Google Analytics tracking

Excluding events from Google analytics tracking, is as simple as assigning a `false` value to the corresponding storybook event.

```js
import { addParameters } from '@storybook/client-api';
import { STORY_CHANGED } from '@storybook/core-events';

addParameters({
  analytics: {
    reactGAId: 'UA-000000-01',
    reactGAOptions: {},
    events: {
      [STORY_CHANGED]: false,
    }
  },
});
```

In this case, `false` as a value for the `STORY_CHANGED` event excludes this event from GA tracking.

Storybook uses the following defaults when it comes to analytics tracking:

| event name | tracked ? |
| STORY_CHANGED | yes |
| STORY_ERRORED | yes |
| STORY_MISSING | yes |

User specified options always take precedence over the default configuration option.

### Excluding events dynamically

There are cases where it's desirable for enabling/disabling tracking of a specific event to be dynamic.
Therefore the event value, in addition to a `boolean` can also be a function that returns a `boolean` value.

```js
import { addParameters } from '@storybook/client-api';
import { STORY_ERRORED } from '@storybook/core-events';

addParameters({
  analytics: {
    reactGAId: 'UA-000000-01',
    reactGAOptions: {},
    events: {
      [STORY_ERRORED]: ({ title }) => title.includes('Expecting a React element from the story')
    }
  },
});
```
In this case, the function returns true if the title of the error matches the provided string.
The function return value in turn, determines if the `STORY_ERRORED` event is tracked or not.

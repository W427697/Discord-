# Storybook Addon Live-Edit

Storybook Addon Knobs allow you to edit your stories and get the result live on your screen. It functions as a playground!

## Getting Started

First of all, you need to install Live Edit into your project as a dev dependency.

```sh
yarn add @storybook/addon-live-edit --dev
```

## Usage
Add as a decorator onto your code!

```js
import React from "react";
import withEditor from "@storybook/addon-live-edit";

// add the withEditor Decorator
export default {
  title: "Storybook Live Edit",
  decorators: [withEditor]
};

// Create your component
export const withAButton = () => (
  <button disabled={boolean("Disabled", false)}>
    {text("Label", "Hello Storybook")}
  </button>
);
```

You can also fine tune and add certain scope variables into your story live edit. This will only add to this story.

```js
import MyOtherComponent from './Myothercomponent';

// add the withEditor Decorator
export default {
  title: "Storybook Live Edit",
  decorators: [withEditor]
};

// Create your component
export const withAButton = () => (
  <button disabled={boolean("Disabled", false)}>
    {text("Label", "Hello Storybook")}
  </button>
);

withAButton.story = {
	name: 'My button changed',
	parameters : {
		scope: {
			ThisIsCertainComponent: MyOtherComponent
		}
	}
}
```

In case you want to reference a list of all your components, in cases where you would like to have a certain story where all the components are available, so designers
and other people that don't code can interact with it! By doing it, all the stories will have these components on it!

Go to your `.storybook/config.js` file: 
```js
// import addParameter
import { configure, addParameter } from '@storybook/react';

import C1 from './C1';
import C2 from './C2';
import C3 from './C3';

addParameter({
	"live-edit": {
		components: {
			/**
			 *  add reference to your components!
			 * where:
			 * key: Reference To that component
			 * value: actual import to it!
			 */
			C1,
			C2,
			C3
		}
	}
});

```

# Customize storybook's UI

You may not like storybook's default UI, we won't judge. If you want something more pretty to look at, or branded for your client/business, that's perfectly fine by us.

We're working on making storybook theme-able and customizable, in the long term this will allow you to manipulate storybook UI to your liking completely.

We already have some customization in place, and we also have some options available for you to add scripts or css to storybook's [manager](/guides/understanding/#manager).


## Inject global script & css in the manager UI

We have a `manager-head.html` for extreme cases, where you want to add some css or script to the [manager UI](/guides/understanding/#manager). This opens up options for embedding storybook and customizing it visually.

> Right now our manager UI is styled mostly using inline styles, and thus our html doesn't have a whole lot of classes you can target.
> 
> We're working on a migration away from inline styles to something that has an api for theming.
> 
> We're also working on an Storybook API allowing you to wrap/replace any of our manager UI components via [plugin](/docs/addons/).

## Inject global script & css in the preview

If your components depend on some global scripts or CSS, you could add those files via webpack, but that will cause your webpack build-time to increase.

If the increase is not significant in your case, it's a valid option, but quite often webpack's build-time is quite an limiting factor and reducing it is quite important. So if you want to just add a few bits of CSS or JavaScript that your components need this is what you need to do:

### Create a `preview-head.html`

Create a file called `preview-head.html` within your storybook config folder (*usually .storybook*).

This file should contain valid HTML. It will be injected into the iframe **once**.

> The iframe is **not** reloaded when switching stories, so any code in the `preview-head.html` will only be executed once.

# Help needed

We know storybook's UI isn't quite the most prettiest thing in the world right now. So if you want to help, that'd be very much welcome!

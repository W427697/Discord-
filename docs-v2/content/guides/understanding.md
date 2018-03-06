# Understanding Storybook.
TODO: should write this section

## Terminalogy and Concepts

### App
TODO: should write this section

### Manager
TODO: should write this section

### Preview

The storybook preview window (main window) is the place where you will see your awesome components rendered.  The preview window renders an iframe, which gives us the following 2 _very_ important benefits.

#### Platform Agnostic

Even through the storybook interface is built in React it can render components built in any framework (eventually), meaning that the whole JS community will one day be able to come together to use this awesome tool. 🤗

#### CSS Containment

Your app (most likely) has its own CSS, as does Storybook. By rendering your components in an iframe we ensure that your components are properly styled with no bleeding in of styles from Storybook.

### Decorators

Storybook has been built to be extensible a lots of ways.
You can write stories is a variety of ways and this already provides a lot of freedom. 
But it can become a little verbose sometimes, like when you want to wrap all your stories in a Redux State Provider, or a Router.

Storybook provides an API for wrapping stories automatically, letting you focus on the component that matters.

-   [Using decorators](/guides/decorators/#usage)
-   [Writing decorators](/guides/decorators/#writing-decorators)

### Addons
TODO: should write this section

#### List of addons
> Note: not every addon is compatible with every UI library

Addons are an integral part of the Storybook ecosystem, and are core to our value proposition. They allow developers to show off the functionality of their components by adding functionality such as:

-   [Actions](https://github.com/storybooks/storybook/tree/master/addons/actions) log that a function has been called in a similar manner to Jasmine spies and Jest mocks.
-   [Links](https://github.com/storybooks/storybook/tree/master/addons/links) allow you to link stories together, allowing for you to build full demos within Storybook.
-   [Knobs](https://github.com/storybooks/storybook/tree/master/addons/knobs) allow you to edit React props dynamically using the Storybook UI. This allows you to dynamically change things like component text, size, color, disabled state, and more from with the Storybook actions panel
-   [Notes](https://github.com/storybooks/storybook/tree/master/addons/notes) allow you to write notes about your components, so that you can document them for your team.
-   [Info](https://github.com/storybooks/storybook/tree/master/addons/info) allows you to make a full style guide (complete with usage info and code samples) with Storybook
-   [Storyshots](https://github.com/storybooks/storybook/tree/master/addons/storyshots) adds automatic Jest snapshots of your stories.
-   [Console](https://github.com/storybooks/storybook-addon-console) redirects all console statements (`log`, `warn`, and `error`) to the actions panel so you don't need to keep you dev tools open, thus freeing up valuable screen real estate.

## Integration

Using the Storybook API you can retrieve all the stories known to storybook. 
This can be used to write integrations, adding new functionality outside of Storybook itself.

Examples include:

-   Visual regression testing ([Screener.io](https://screener.io), [Percy.io](https://percy.io))
-   Automatic Jest snapshot ([storyshots](/docs/addons/storyshots))
-   Your integration? ([Storybook API](/docs/api))

# Why choose Storybook.

Storybook isn't the only solution out there, so why choose Storybook over something else or creating your own? 
But to do a comparison we need to understand what Storybook's goal and scope is.

We're going to discuss the core concepts of Storybook which will list Storybook's key-selling-features.

# Storybook Concepts

## Isolated Component Driven Development

Storybook allows for components to be developed in isolation from the rest of your app.

### Apps with Application State Management

For apps that use application state management, like Redux or RxJS, storybook allows components to be fully developed with mocked application state passed in. This allows for a consitent and fast development environment that never required a developer to click through their app (or create new records, etc) just to test on screen.

### Large Apps

For large apps, that may have a multiple backends (distributed or microservice based) running a development environment can use a lot of system resources and slow down your machine.  By developing UI components in isolation, there is no need to run a backend thus preserving valuable system resources. 🎉

### For Designers Who Code

Agile teams will often have a designer who can code at least basic HTML and CSS, by allowing them the ability to work on components in isolation designers can take some of the UI burden off of engineers allowing them to focus on functionality (and writing test).

### For Designers and PMs Who Don't Code

Designers and PMs who don't code now have the ability to demo changes their teams are making without having to deploy to a staging server or run a local dev environment.

## Manager

lalala **TODO** lalala

## Preview

The storybook preview window (main window) is the place where you will see your awesome components rendered.  The preview window renders an iframe, which gives us the following 2 _very_ important benefits.

### Platform Agnostic

Even through the storybook interface is built in React it can render components built in any framework (eventually), meaning that the whole JS community will one day be able to come together to use this awesome tool. 🤗

### CSS Containment

Your app (most likely) has its own CSS, as does Storybook. By rendering your components in an iframe we ensure that your components are properly styled with no bleeding in of styles from Storybook.

## Decorators

Storybook has been built to be extensible a lots of ways.
You can write stories is a variety of ways and this already provides a lot of freedom. 
But it can become a little verbose sometimes, like when you want to wrap all your stories in a Redux State Provider, or a Router.

Storybook provides an API for wrapping stories automatically, letting you focus on the component that matters.

-   [Using decorators](/guides/decorators/#usage)
-   [Writing decorators](/guides/decorators/#writing-decorators)

## Addons

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

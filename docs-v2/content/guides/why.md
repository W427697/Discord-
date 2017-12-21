# Why choose Storybook.

What is storybook and why should you use it? **Storybook is the UI development environment you'll love to use**. It's a tool that will assist you to build, document and test UI components.

Storybook isn't the only solution out there, so why choose Storybook over something else or creating your own? 
But to do a comparison we need to understand what Storybook's goal and scope is.

We're going to discuss the core concepts of Storybook which will list Storybook's key-selling-features.

## Philosophy

Storybook allows for components to be developed in isolation from the rest of your app. Something we call **isolated component driven development**.

## Use cases

### Apps with Application State Management

For apps that use application state management, like Redux or RxJS, storybook allows components to be fully developed with mocked application state passed in. This allows for a consitent and fast development environment that never required a developer to click through their app (or create new records, etc) just to test on screen.

### Large Apps

For large apps, that may have a multiple backends (distributed or microservice based) running a development environment can use a lot of system resources and slow down your machine.  By developing UI components in isolation, there is no need to run a backend thus preserving valuable system resources. 🎉

Large apps can also suffer from having many components in a hard to reach configuration. Good examples are: validation-error-Components or server-500-Components, etc.

### For Designers Who Code

Agile teams will often have a designer who can code at least basic HTML and CSS, by allowing them the ability to work on components in isolation designers can take some of the UI burden off of engineers allowing them to focus on functionality (and writing test).

### For Designers and PMs Who Don't Code

Designers and PMs who don't code now have the ability to demo changes their teams are making without having to deploy to a staging server or run a local dev environment.

Viewing a component in isolation versus on a complete page, can also be very valuable, as the review can be done quicker and without distractions.

### Create a catalog of existing code / components

Onboarding new people unto the team can be hard. By having a Living styleguide of the application that explains the story of your applications and it's components can really help newcomers understand what your application is about.

As more components are easily discoverable, less duplication should occur, and should it still occur it will be plainly visible.

## Terminalogy and Concepts
Want to [understand storybook better](/guides/understanding/)? The [Terminology](/guides/understanding/#terminalogy-and-concepts) like [manager](/guides/understanding/#manager) [preview](/guides/understanding/#preview) [decorators](/guides/understanding/#decorators) [addons](/guides/understanding/#addons) [app](/guides/understanding/#app) can be found on the [understand storybook](/guides/understanding/) section.

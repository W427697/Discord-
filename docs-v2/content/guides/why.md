# Why choose Storybook.

Storybook isn't the only solution out there, so why choose Storybook over something else or creating your own? 
But to do a comparison we need to understand what Storybook's goal and scope is.

We're going to discuss the core concepts of Storybook which will list Storybook's key-selling-features.

# Storybook Concepts

## Isolated Component Driven Development

lalala **TODO** lalala..

## Manager

lalala **TODO** lalala

## Preview

lalala **TODO** lalala

# Decorators

:::Note { amazingly: true }
currently React only
:::

Storybook has been built to be extensible a lots of ways.
You can write stories is a variaty of ways and this already provides a lot of freedom. 
But it can become a little verbose sometimes, like when you want to wrap all your stories in a Redux State Provider, or a Router.

Storybook provides an API for wrapping stories automaticly, letting you focus on the component that matters.

-   [Using decorators](/guides/decorators/#usage)
-   [Writing decorators](/guides/decorators/#writing-decorators)

# Addons

:::Note
not every addon is compatible with every UI library
:::

-   [Using decorators](/guides/decorators/#usage)
-   [Writing decorators](/guides/decorators/#writing-decorators)

## Integration

Using the Storybook API you can retrieve all the stories known to storybook. 
This can be used to write integrations, adding new functionality outside of Storybook itself.

Examples include:

-   Visual regression testing ([Screener.io](https://screener.io), [Percy.io](https://percy.io))
-   Automatic Jest snapshot ([storyshots](/addons/storyshots))
-   Your integration?


-   [Storybook API](/docs/api)

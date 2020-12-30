---
title: 'Unit testing with Storybook'
---

Unit tests are useful for verifying functional aspects of components. They verify that the output of a component remains the same given a fixed input.

![Unit testing with a component](./component-unit-testing.gif)

Thanks to the [CSF format](../api/csf), your stories are reusable in unit testing tools. Each [named export](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export) is “renderable” without depending on Storybook. That means your testing framework will also be able to render that story.

Here is an example of how you can use it in a testing library:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'react/button-test.js.mdx',
    'vue/button-test.js.mdx',
    'angular/button-test.ts.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

## Testing more complex components

When your components use functionality from tools like [styled components](http://styled-components.com/) or [redux](https://redux.js.org/), it's necessary to wrap your stories in [decorators](../writing-stories/decorators#story-decorators) so that the extra functionality is available in your stories. If that is the case, you can use a testing utility (currently only available in Storybook for React) to reuse your stories in your tests, and all the decorators, parameters and args of that story will be automatically applied in the component. This makes your test file look quite clean and just reuse the configuration done in the Storybook side, making the maintenance of your testing setup simpler.

Here is an example of how you can use it in a testing library:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'react/button-test-utility.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

Unit tests can be brittle and expensive to maintain for _every_ component. We recommend combining unit tests with other testing methods like [visual regression testing](./visual-testing.md) for comprehensive coverage with less maintenance work.
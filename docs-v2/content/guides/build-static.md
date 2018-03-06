# Build and deploy a static version of your storybook

Getting fast feedback on development of UI-components is super important. 
Showcasing on your local machine can work up to a point; but when your team work partly remote, or you're working on multiple features in parallel, this can become a chore.

It's really valuable to have a permanent url for a particular moment in history of your component library, 
to reference it again later, or possibly trace down a bug.

For this purpose storybook has made it super easy for you to create a static version of your storybook so deploying it somewhere is a breeze.

## Why a static version

You can deploy the non-static version of storybook to something like [heroku](https://www.heroku.com/), [now](https://zeit.co/now), or [similar](http://bit.ly/2kmFvyt). Anywhere you can run NodeJS, you can run a storybook instance. However if you generate a static version (*just HTML, CSS & JS*), which has no server-side logic at all, other hosting options open up, like [GitHub Pages](https://pages.github.com/).

You can host static files for free in many places, and is very very cheap. It's long-term cachable too. We use [Netlify](https://www.netlify.com/) ourselves and are super happy with their service and can highly recommend it

## Downsides to static version

A few features of storybook are not available when generating a static version.

In dev-mode storybook can [proxy requests](/) TODO: link and even allow you to [inject express middleware or routes](/) TODO: link. 
This cannot be supported in a static version because it requires server-side logic.

Also a static version will try to optimize bundlesize and ship with minified code and libraries, this may make debugging less easy.

## How to generate a static version

As detailed in our [documentation section about the CLI](/docs/cli) you can execute the command:

```sh
build-storybook
```

This will generate a static version with the default settings. Check out the [settings for the CLI](/docs/cli).

We recommend you add a npm script to your `package.json`:
```json
{
  "scripts": {
    "storybook": "build-storybook -c .storybook -o .out"
  }
}
```

## Deploy storybook

### Dynamic version

Deploying a storybook to production that is still dynamic is an option. 
Generating a static version of storybook has some downsides... so you may find yourself needing to deploy the dev-mode of storybook.

If you can `npm install` and `npm start` somewhere, you can run storybook there! Storybook is compatible with the latest LTS of NodeJS. We might we compatible with lower versions, but we don't test for it.

### Static version

After generating the static version, you can use the [`gh-pages`](https://www.npmjs.com/package/gh-pages) package to upload the static files to [GitHub Pages](https://pages.github.com/). You can also [read this guide](https://github.com/blog/2233-publish-your-project-documentation-with-github-pages) on how it works.

If you want a command that will build storybook into a static version and upload to GitHub Pages in 1 command, we have got your back: this is exactly what our [storybook-deployer](https://github.com/storybooks/storybook-deployer) package can do for you!

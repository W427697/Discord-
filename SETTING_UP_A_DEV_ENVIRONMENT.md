# Setting up a dev environment

So you want to set up a dev environment? AWESOME!!! This doc is here to help you get set up as quickly and painlessly as possible so you can start contributing to storybook.

## Prerequisites

Please have the latest versions of the following on your machine

-   node
-   npm
-   yarn
-   create-react-app
-   @storybook/cli

Yes, we are using `npm` not `yarn` but you still need the latest version of both as there is a bootstrap script that uses both

## Setting it up

### 1.  Setup storybook locally

If you run into trouble here, make sure your node, npm, and yarn are on the latest versions.

1.  `cd ~` (optional)
2.  `git clone https://github.com/storybooks/storybook.git` _bonus_: use your own fork for this step
3.  `cd storybook`
4.  `npm install`
5.  `npm run bootstrap`<sup>1</sup>
6.  At the prompt: `a`, `enter`, `y`, `enter`
7.  Have a beer 🍺
8.  `npm test`

<sup>1</sup>You can run `npm run bootstrap --core` - there will be no prompt and it will be WAY faster, but some tests will fail

### 2. Link storybook

Storybook is broken up into sub-projects that you can install as you need them. For this experiment we will be working with `@storybook/react`. 
**Note:** You need to `npm link` from inside the sub project you are working on **_NOT_** the storybook root directory

1.  `cd app/react`
2.  `npm link`

### 3. Create a demo project

1.  `cd ~` (optional)
2.  `create-react-app storybook-sandbox-app`
3.  `cd storybook-sandbox-app`
4.  `npm start`
5.  Verify that you have a working react app.

### 4. Setup storybook in your demo project

First we are going to install storyboook, then we are going to link `@storybook/react` into our project. This will replace `node_modules/@storybook/react` with a symlink to our local version of storybook. 

1.  `getstorybook`
2.  `npm run storybook`
3.  Verify that storybook works

### 5. Get them working together

1.  Go to your storybook _root_ directory 
2.  `npm run dev`
3.  Wait for the output to stop 
4.  Go to your storybook-sandbox-app directory
5.  `npm link @storybook/react`
6.  `npm run storybook`

## Hacking (optional)

You should now have a working storybook dev environment up and running. To verify this you can follow the following steps from your storybook root directory.

`open app/react/src/client/manager/preview.js`

Change the render method to return

```JSX
<div>
  <h1>Hello World 😎</h1>
  <iframe
    id="storybook-preview-iframe"
    title="preview"
    style={iframeStyle}
    src={this.props.url}
    allowFullScreen
  />
</div>
```

Save and go to `http://localhost:9009` (or wherever storybook is running)

If you don't see the changes rerun `npm run storybook` in your sandbox app

## Issues

If you had any issues following this tutorial, please don't hesitate to open up a support ticket.

If you have any improvements to this tutorial, please don't hesitate to open up a pull request.

If you still have questions after going throught this tutorial (and you have confirmed that your versions of node, npm and yarn are up to date) come reach out to us on slack at <https://storybooks.slack.com/>

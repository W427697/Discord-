# Setting up a dev environment (React)

This guide is here to help you get a local version of Storybook running so that you can hack on it
and contribute back to the community.

## Prerequisites

Please have the **_latest_** stable versions of the following on your machine

-   node
-   npm
-   yarn
-   create-react-app

## Setting it up

### 1.  Setup storybook locally

If you run into trouble here, make sure your node, npm, and **_yarn_** are on the latest versions.

1.  `cd ~` (optional)
2.  `git clone https://github.com/storybooks/storybook.git` _bonus_: use your own fork for this step
3.  `cd storybook`
4.  `yarn`
5.  `yarn bootstrap --core`
6.  `yarn test --core` (to verify everything worked)
7.  `yarn dev` *You must have this running for your changes to show up*

#### Bootstrapping everything

This method is slow, and if you are reading this tutorial you probably don't want to do it

1.  `yarn bootstrap --all`
2.  Have a beer 🍺
3.  `yarn test` (to verify everything worked)
4.  `yarn dev` *You must have this running for your changes to show up*

### Working with the kitchen sink apps

Within the `examples` folder of the Storybook repo, you will find kitchen sink examples of storybook implementations for the various platforms that storybook supports.

Not only do these show many of the options and addons available, they are also automatically linked to all the development packages. We highly encourage you to use these to develop/test contributions on.

#### React and Vue

1. `yarn storybook`
2. Verify that your local version works

### Working with your own app

#### Linking Storybook

Storybook is broken up into sub-projects that you can install as you need them. For this example we will be working with `@storybook/react`.
**Note:** You need to `yarn link` from inside the sub project you are working on **_NOT_** the storybook root directory

1.  `cd app/react`
2.  `yarn link`

#### Connecting Your App To Storybook

**_Note:_** If you aren't seeing addons after linking storybook, you probably have a versioning issue which can be fixed by simply linking each addon you want to use.
This applies for the kitchen sink apps as well as your own projects.

*Make sure `yarn dev` is running*

##### Setup storybook in your project

First we are going to install storyboook, then we are going to link `@storybook/react` into our project. This will replace `node_modules/@storybook/react` with a symlink to our local version of storybook. 

1.  `getstorybook`
2.  `yarn storybook`
3.  Verify that your local version works

##### Link

**_Note_**: This process is the same for `@storybook/vue`, `@storybook/addon-foo`, etc

1.  Go to your storybook _root_ directory 
2.  `yarn dev`
3.  Wait until the output stops (changes you make will be transpiled into dist and logged here)
4.  Go to your storybook-sandbox-app directory
5.  `yarn link @storybook/react`
6.  `yarn storybook`

##### Verify your local version is working

You should now have a working storybook dev environment up and running. To verify this you can make changes to the following file:

`open app/react/src/client/manager/preview.js`

Save and go to `http://localhost:9009` (or wherever storybook is running)

If you don't see the changes rerun `yarn storybook` again in your sandbox app

##### Gotchas

If you don't see any addons, its probably because there is a version difference between the version of Storybook CLI you are using and the versin of storybook in your local branch. To fix this, simply follow steps 4 and 5 above with each of the addons you would like to use.


## Issues

If you have any improvements to this tutorial, please don't hesitate to open up a pull request.

If you still have questions after going through this tutorial (and you have confirmed that your versions of node, npm and yarn are up to date) come reach out to us on slack at <https://storybooks.slack.com/>

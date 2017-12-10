# Setup Storybook

Storybook should be really easy to setup for most types of projects. Whether your project is already setup and you have a component library already, or you want to work on some components before actually having to setup an app, state, etc, storybook can help your project out.

In this section we're going to be discovering how to setup storybook for your project.

## Add storybook to your project

### Using the Storybook CLI

If you have just started your project using a boilerplate / starterkit like Create React App, or your framework's CLI. 
You can use Storybook's CLI to add storybook to your project. The CLI will detect which template to apply based on your `package.json`.

```sh
npm i -g @storybook/cli
cd my-react-app
getstorybook
```

### Manually add storybook to your project

Using the Storybook CLI may also work for your custom setup, but often users who have their own custom setup also need a more customized setup for storybook as well. And it helps understanding exactly what the Storybook CLI is doing for you. 

-   [How to manually setup Storybook](/guides/manual-setup/)

## Checking it worked

After adding Storybook, you can run your Storybook with:

```sh
npm run storybook
```

Then you can access your storybook from the browser (the url should be printed in the terminal).

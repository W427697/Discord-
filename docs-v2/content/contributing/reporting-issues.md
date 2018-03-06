# Reporting Issues

No software is bug free. So, if you got an issue, please help the community by letting us know.

## First Steps

-   Search the [issue list](https://github.com/storybooks/storybook/issues?utf8=%E2%9C%93&q=) for current and old issues.
    -   If you find an existing issue, please UPVOTE the issue by adding a "thumbs-up reaction". We use this to help prioritize issues!
-   If none of that is helping, create an issue with with following information:
    -   Clear title (shorter is better).
    -   Describe the issue in clear language.
    -   Share error logs, screenshots and etc.
    -   To speed up the issue fixing process, send us a sample repo with the issue you faced:

### Testing against `master`

To test your project against the current latest version of storybook, you can clone the repository and link it with `yarn`. Try following these steps:

#### 1. Download the latest version of this project, and build it:

```sh
git clone https://github.com/storybooks/storybook.git
cd storybook
yarn install
yarn bootstrap
```

The bootstrap command will ask which sections of the codebase you want to bootstrap. Unless you're going to work with ReactNative or the Documentation, you can keep the default.

You can also pick directly from CLI:

```sh
yarn bootstrap --core
```

#### 2a. Run unit tests

You can use one of the example projects in `examples/` to develop on.

This command will list all the suites and options for running tests. 

```sh
yarn test
```

_Note that in order to run the tests fro ReactNative, you must have bootstrapped with ReactNative enabled_

You can also pick suites from CLI:

```sh
yarn test --core
```

In order to run ALL unit tests, you must have bootstrapped the react-native

#### 2b. Run e2e tests for CLI

If you made any changes to `lib/cli` package, the easiest way to verify that it doesn't break anything is to run e2e tests:

```sh
yarn test --cli
```

This will run a bash script located at `lib/cli/test/run_tests.sh`. It will copy the contents of `fixtures` into a temporary `run` directory, run `getstorybook` in each of the subdirectories, and check that storybook starts successfully using `yarn storybook --smoke-test`.

After that, the `run` directory content will be compared with `snapshots`. You can update the snapshots by passing an `--update` flag:

```sh
yarn test --cli --update
```

In that case, please check the git diff before commiting to make sure it only contains the intended changes.

#### 2c. Link `storybook` and any other required dependencies:

If you want to test your own existing project using the github version of storybook, you need to `link` the packages you use in your project.

```sh
cd app/react
yarn link

cd <your-project>
yarn link @storybook/react

# repeat with whichever other parts of the monorepo you are using.
```

### Reproductions

The best way to help figure out an issue you are having is to produce a minimal reproduction against the `master` branch.

A good way to do that is using the example `cra-kitchen-sink` app embedded in this repository:

```sh
# Download and build this repository:
git clone https://github.com/storybooks/storybook.git
cd storybook
yarn install
yarn bootstrap

# make changes to try and reproduce the problem, such as adding components + stories
cd examples/cra-kitchen-sink
yarn storybook

# see if you can see the problem, if so, commit it:
git checkout "branch-describing-issue"
git add -A
git commit -m "reproduction for issue #123"

# fork the storybook repo to your account, then add the resulting remote
git remote add <your-username> https://github.com/<your-username>/storybook.git
git push -u <your-username> master
```

If you follow that process, you can then link to the github repository in the issue. See <https://github.com/storybooks/storybook/issues/708#issuecomment-290589886> for an example.

**NOTE**: If your issue involves a webpack config, create-react-app will prevent you from modifying the _app's_ webpack config, however you can still modify storybook's to mirror your app's version of storybook. Alternatively, use `yarn eject` in the CRA app to get a modifiable webpack config.

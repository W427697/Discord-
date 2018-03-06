# CLI

Storybook has 3 CLI commands which allow you to add, start or build storybook.

The CLI for [adding storybook to your project](/guides/setup/) is explained in detail in the [guides section](/guides/setup/).

You'll get the `start-storybook` and `build-storybook` commands get by installing an [app](/guides/understanding/). 
It's advised to create a `npm` script, for more information [see the setup guide](/guides/manual-setup/).

## start-storybook
This is the command you'll use most often, it starts storybook in dev-mode.

It starts the installed app (`@storybook/react` for example) and serve it on your local machine.
The process will not exit until you force it with `CTRL+C`

**Usage**
```sh
start-storybook [options]
```

**Options**
```
-h, --help                    output usage information
-V, --version                 output the version number
-p, --port [number]           Port to run Storybook (Required)
-h, --host [string]           Host to run Storybook
-s, --static-dir [dir-names]  Directory where to load static files from, comma-separated list
-c, --config-dir [dir-name]   Directory where to load Storybook configurations from
```

## build-storybook
This will build a static version of your storybook. It will not start serving, it will exit with a non-0 exit code if the build failed.

**Usage**
```sh
build-storybook [options]
```

**Options**
```
-h, --help                    output usage information
-V, --version                 output the version number
-s, --static-dir [dir-names]  Directory where to load static files from, comma-separated list
-o, --output-dir [dir-name]   Directory where to store built files
-c, --config-dir [dir-name]   Directory where to load Storybook configurations from
```

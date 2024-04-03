---
title: 'CLI options'
---

The Storybook command line interface (CLI) is the main tool you use to build and develop Storybook.

<Callout variant="info">

Storybook collects completely anonymous data to help us improve user experience. Participation is optional, and you may [opt-out](../configure/telemetry.md#how-to-opt-out) if you'd not like to share any information.

</Callout>

## API commands

All of the following documentation is available in the CLI by running `storybook --help`.

<Callout variant="info" icon="💡">

Passing options to these commands works slightly differently if you're using npm instead of Yarn. You must prefix all of your options with `--`. For example, `npm run storybook build -- -o ./path/to/build --quiet`.

</Callout>

### `dev`

Compiles and serves a development build of your Storybook that reflects your source code changes in the browser in real-time. It should be run from the root of your project.

```shell
storybook dev [options]
```

Options include:

| Option                          | Description                                                                                                                                                               |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--help`                        | Output usage information <br/>`storybook dev --help`                                                                                                                      |
| `-V`, `--version`               | Output the version number <br/>`storybook dev -V`                                                                                                                         |
| `-p`, `--port [number]`         | Port to run Storybook <br/>`storybook dev -p 9009`                                                                                                                        |
| `--exact-port [number]`         | Use desired port and exit process if it's not available <br/>`storybook dev --exact-port 9009`                                                                            |
| `-h`, `--host [string]`         | Host to run Storybook <br/>`storybook dev -h my-host.com`                                                                                                                 |
| `-c`, `--config-dir [dir-name]` | Directory where to load Storybook configurations from <br/>`storybook dev -c .storybook`                                                                                  |
| `--loglevel [level]`            | Controls level of logging during build.<br/> Available options: `silly`, `verbose`, `info` (default), `warn`, `error`, `silent`<br/>`storybook dev --loglevel warn`       |
| `--https`                       | Serve Storybook over HTTPS. Note: You must provide your own certificate information<br/>`storybook dev --https`                                                           |
| `--ssl-ca`                      | Provide an SSL certificate authority. (Optional with --https, required if using a self-signed certificate)<br/>`storybook dev --ssl-ca my-certificate`                    |
| `--ssl-cert`                    | Provide an SSL certificate. (Required with --https)<br/>`storybook dev --ssl-cert my-ssl-certificate`                                                                     |
| `--ssl-key`                     | Provide an SSL key. (Required with --https)<br/>`storybook dev --ssl-key my-ssl-key`                                                                                      |
| `--smoke-test`                  | Exit after successful start<br/>`storybook dev --smoke-test`                                                                                                              |
| `--ci`                          | CI mode (skip interactive prompts, don't open browser)<br/>`storybook dev --ci`                                                                                           |
| `--no-open`                     | Do not open Storybook automatically in the browser<br/>`storybook dev --no-open`                                                                                          |
| `--quiet`                       | Suppress verbose build output<br/>`storybook dev --quiet`                                                                                                                 |
| `--debug`                       | Outputs more logs in the CLI to assist debugging<br/>`storybook dev --debug`                                                                                              |
| `--debug-webpack`               | Display final webpack configurations for debugging purposes<br/>`storybook dev --debug-webpack`                                                                           |
| `--stats-json [dir-name]`       | Write stats JSON to disk<br/>`storybook dev --stats-json /tmp/stats`<br/>NOTE: only works for Webpack.                                                                    |
| `--no-version-updates`          | Suppress Storybook's update check<br/>`storybook dev --no-version-updates`                                                                                                |
| `--docs`                        | Starts Storybook in documentation mode. Learn more about it in [here](../writing-docs/build-documentation.md#preview-storybooks-documentation)<br/>`storybook dev --docs` |
| `--initial-path [path]`         | URL path to be appended when visiting Storybook for the first time<br/>`storybook dev --initial-path=/docs/getting-started--docs`                                         |
| `--preview-url [path]`          | Disables the default Storybook preview and lets your use your own<br/>`storybook dev --preview-url=http://localhost:1337/external-iframe.html`                            |
| `--force-build-preview`         | Build the preview iframe even if you are using --preview-url<br/>`storybook dev --force-build-preview`                                                                    |
| `--enable-crash-reports`        | Enable sending crash reprots to Storybook's telemetry. Learn more about it [here](../configure/telemetry.md).<br/>`storybook dev --disable-telemetry`                     |
| `--disable-telemetry`           | Disables Storybook's telemetry. Learn more about it [here](../configure/telemetry.md)<br/>`storybook dev --disable-telemetry`                                             |

<Callout variant="warning" id="static-dir-deprecation">

With the release of Storybook 8, the `-s` CLI flag was removed. We recommend using the [static directory](../configure/images-and-assets.md#serving-static-files-via-storybook) instead if you need to serve static files.

</Callout>

### `build`

Compiles your Storybook instance so it can be [deployed](../sharing/publish-storybook.md). It should be run from the root of your project.

```shell
storybook build [options]
```

Options include:

| Option                          | Description                                                                                                                                                                                           |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `-h`, `--help`                  | Output usage information<br/>`storybook build --help`                                                                                                                                                 |
| `-V`, `--version`               | Output the version number<br/>`storybook build -V`                                                                                                                                                    |
| `-o`, `--output-dir [dir-name]` | Directory where to store built files<br/>`storybook build -o /my-deployed-storybook`                                                                                                                  |
| `-c`, `--config-dir [dir-name]` | Directory where to load Storybook configurations from<br/>`storybook build -c .storybook`                                                                                                             |
| `--loglevel [level]`            | Controls level of logging during build.<br/> Available options: `silly`, `verbose`, `info` (default), `warn`, `error`, `silent`<br/>`storybook build --loglevel warn`                                 |
| `--quiet`                       | Suppress verbose build output<br/>`storybook build --quiet`                                                                                                                                           |
| `--debug`                       | Outputs more logs in the CLI to assist debugging<br/>`storybook build --debug`                                                                                                                        |
| `--debug-webpack`               | Display final webpack configurations for debugging purposes<br/>`storybook build --debug-webpack`                                                                                                     |
| `--stats-json [dir-name]`       | Write stats JSON to disk<br/>`storybook build --stats-json /tmp/stats`                                                                                                                                |
| `--docs`                        | Builds Storybook in documentation mode. Learn more about it in [here](../writing-docs/build-documentation.md#publish-storybooks-documentation)<br/>`storybook build --docs`                           |
| `--test`                        | Optimize Storybook's production build for performance and tests by removing unnecessary features with the `test` option. Learn more [here](../api/main-config-build.md).<br/>`storybook build --test` |
| `--preview-url [path]`          | Disables the default Storybook preview and lets your use your own<br/>`storybook build --preview-url=http://localhost:1337/external-iframe.html`                                                      |
| `--force-build-preview`         | Build the preview iframe even if you are using --preview-url<br/>`storybook build --force-build-preview`                                                                                              |
| `--enable-crash-reports`        | Enable sending crash reprots to Storybook's telemetry. Learn more about it [here](../configure/telemetry.md).<br/>`storybook build --disable-telemetry`                                               |
| `--disable-telemetry`           | Disables Storybook's telemetry. Learn more about it [here](../configure/telemetry.md).<br/>`storybook build --disable-telemetry`                                                                      |

<!-- Re-read this for accuracy -->

### `init`

Installs and initializes the specified version (e.g., `@latest`, `@8`, `@next`) of Storybook into your project. Read more in the [installation guide](../get-started/install.md).

```shell
storybook[@version] init [options]
```

For example, `storybook@latest init` will install the latest version of Storybook into your project.

Options include:

| Option                   | Description                                                                                                                                                                                 |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--help`                 | Output usage information <br/>`storybook init --help`                                                                                                                                       |
| `-b`, `--builder`        | Defines the [builder](../builders/index.md) to use for your Storybook instance<br/>`storybook init --builder webpack5`                                                                      |
| `-f`,`--force`           | Forcefully installs Storybook into your project, prompting you to overwrite existing files<br/>`storybook init --force`                                                                     |
| `-s`, `--skip-install`   | Skips the dependency installation step. Used only when you need to configure Storybook manually<br/>`storybook init --skip-install`                                                         |
| `-t`, `--type`           | Defines the [framework](../configure/frameworks.md) to use for your Storybook instance<br/>`storybook init --type solid`                                                                    |
| `-y`, `--yes`            | Skips interactive prompts and automatically installs Storybook per specified version<br/>`storybook init --yes`                                                                             |
| `--package-manager`      | Sets the package manager to use when installing the addon.<br/> Available package managers include `npm`, `yarn`, and `pnpm`<br/>`storybook init --package-manager pnpm`                    |
| `--use-pnp`              | Enables [Plug'n'Play](https://yarnpkg.com/features/pnp) support for Yarn. This option is only available when using Yarn as your package manager<br/>`storybook init --use-pnp`              |
| `-p`, `--parser`         | Sets the [jscodeshift parser](https://github.com/facebook/jscodeshift#parser).<br/> Available parsers include `babel`, `babylon`, `flow`, `ts`, and `tsx`<br/>`storybook init --parser tsx` |
| `--debug`                | Outputs more logs in the CLI to assist debugging<br/>`storybook init --debug`                                                                                                               |
| `--disable-telemetry`    | Disables Storybook's telemetry. Learn more about it [here](../configure/telemetry.md)<br/>`storybook init --disable-telemetry`                                                              |
| `--enable-crash-reports` | Enable sending crash reprots to Storybook's telemetry. Learn more about it [here](../configure/telemetry.md).<br/>`storybook init --disable-telemetry`                                      |

### `add`

Installs a Storybook addon and configures your project for it. Read more in the [addon installation guide](../addons/install-addons.md).

```shell
storybook add [addon] [options]
```

Options include:

| Option                     | Description                                                                                                                                                                     |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--help`                   | Output usage information <br/>`storybook add --help`                                                                                                                            |
| `--package-manager`        | Sets the package manager to use when installing the addon.<br/> Available package managers include `npm`, `yarn`, and `pnpm`<br/>`storybook add [addon] --package-manager pnpm` |
| `-s`, `--skip-postinstall` | Skips post-install configuration. Used only when you need to configure the addon yourself<br/>`storybook add [addon] --skip-postinstall`                                        |
| `--debug`                  | Outputs more logs in the CLI to assist debugging<br/>`storybook add --debug`                                                                                                    |
| `--disable-telemetry`      | Disables Storybook's telemetry. Learn more about it [here](../configure/telemetry.md)<br/>`storybook add --disable-telemetry`                                                   |
| `--enable-crash-reports`   | Enable sending crash reprots to Storybook's telemetry. Learn more about it [here](../configure/telemetry.md).<br/>`storybook add --disable-telemetry`                           |

### `remove`

Deletes a Storybook addon from your project. Read more in the [addon installation guide](../addons/install-addons.md#removing-addons).

```shell
storybook remove [addon] [options]
```

Options include:

| Option                   | Description                                                                                                                                                                    |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `--help`                 | Output usage information <br/>`storybook remove --help`                                                                                                                        |
| `--package-manager`      | Sets the package manager to use when removing the addon.<br/>Available package managers include `npm`, `yarn`, and `pnpm`<br/>`storybook remove [addon]--package-manager pnpm` |
| `--debug`                | Outputs more logs in the CLI to assist debugging<br/>`storybook remove --debug`                                                                                                |
| `--disable-telemetry`    | Disables Storybook's telemetry. Learn more about it [here](../configure/telemetry.md)<br/>`storybook remove --disable-telemetry`                                               |
| `--enable-crash-reports` | Enable sending crash reprots to Storybook's telemetry. Learn more about it [here](../configure/telemetry.md).<br/>`storybook remove --disable-telemetry`                       |

### `upgrade`

Upgrades your Storybook instance to the specified version (e.g., `@latest`, `@8`, `@next`). Read more in the [upgrade guide](../configure/upgrading.md).

```shell
storybook[@version] upgrade [options]
```

For example, `storybook@latest upgrade --dry-run` will perform a dry run (no actual changes) of upgrading your project to the latest version of Storybook.

Options include:

| Option                   | Description                                                                                                                                                                 |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--help`                 | Output usage information <br/>`storybook upgrade --help`                                                                                                                    |
| `-c`, `--config-dir`     | Directory where to load Storybook configurations from<br/>`storybook upgrade --config-dir .storybook`                                                                       |
| `-n`, `--dry-run`        | Checks for version upgrades without installing them<br/>`storybook upgrade --dry-run`                                                                                       |
| `-s`, `--skip-check`     | Skips the migration check step during the upgrade process<br/> `storybook upgrade --skip-check`                                                                             |
| `-y`, `--yes`            | Skips interactive prompts and automatically upgrades Storybook to the latest version<br/>`storybook upgrade --yes`                                                          |
| `-f`,`--force`           | Force the upgrade, skipping autoblockers check<br/>`storybook upgrade --force`                                                                                              |
| `--package-manager`      | Sets the package manager to use when installing the addon.<br/> Available package managers include `npm`, `yarn`, and `pnpm`<br/>`storybook upgrade --package-manager pnpm` |
| `--debug`                | Outputs more logs in the CLI to assist debugging<br/>`storybook upgrade --debug`                                                                                            |
| `--disable-telemetry`    | Disables Storybook's telemetry. Learn more about it [here](../configure/telemetry.md)<br/>`storybook upgrade --disable-telemetry`                                           |
| `--enable-crash-reports` | Enable sending crash reprots to Storybook's telemetry. Learn more about it [here](../configure/telemetry.md).<br/>`storybook upgrade --disable-telemetry`                   |

### `migrate`

Runs a specified codemod to migrate your project to use more modern Storybook standards.

```shell
storybook[@version] migrate [codemod] [options]
```

<Callout variant="info">

The command needs a specific codemod to be specified, e.g. `csf-2-to-3`. To get a list of available codemods, run the CLI command with the `--list` flag.

</Callout>

For example, `storybook@latest migrate csf-2-to-3 --dry-run` will verify that the codemod is applicable to your files and will show which files would be affected by the codemod in a dry run (no actual changes).

Options include:

| Option                     | Description                                                                                                                                                                                    |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--help`                   | Output usage information <br/>`storybook migrate --help`                                                                                                                                       |
| `-c`, `--config-dir`       | Directory where to load Storybook configurations from<br/>`storybook migrate --config-dir .storybook`                                                                                          |
| `-n`, `--dry-run`          | Verify the migration exists and show the files to which it will be applied<br/>`storybook migrate --dry-run`                                                                                   |
| `-l`, `--list`             | Shows a list of available codemods<br/> `storybook migrate --list`                                                                                                                             |
| `-g`, `--glob`             | Glob for files upon which to apply the codemods<br/>`storybook migrate --glob src/**/*.stories.tsx`                                                                                            |
| `-p`, `--parser`           | Sets the [jscodeshift parser](https://github.com/facebook/jscodeshift#parser).<br/> Available parsers include `babel`, `babylon`, `flow`, `ts`, and `tsx`<br/>`storybook migrate --parser tsx` |
| `-r`, `--rename [from-to]` | Rename suffix of matching files after codemod has been applied, e.g. `.js:.ts`<br/>`storybook migrate --rename ".js:.ts"`                                                                      |
| `--debug`                  | Outputs more logs in the CLI to assist debugging<br/>`storybook migrate --debug`                                                                                                               |
| `--disable-telemetry`      | Disables Storybook's telemetry. Learn more about it [here](../configure/telemetry.md)<br/>`storybook migrate --disable-telemetry`                                                              |
| `--enable-crash-reports`   | Enable sending crash reprots to Storybook's telemetry. Learn more about it [here](../configure/telemetry.md).<br/>`storybook migrate --disable-telemetry`                                      |

### `automigrate`

Check Storybook for incompatibilities or migrations and apply fixes.

```shell
storybook[@version] automigrate [fixId] [options]
```

For example, `storybook@latest automigrate --dry-run` will scan your codebase and tell which automigrations are applicable in a dry run (no actual changes).

Options include:

| Option                   | Description                                                                                                                                                                                                          |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- |
| `--help`                 | Output usage information <br/>`storybook automigrate --help`                                                                                                                                                         |
| `-c`, `--config-dir`     | Directory where to load Storybook configurations from<br/>`storybook automigrate --config-dir .storybook`                                                                                                            |
| `-n`, `--dry-run`        | Only checks for fixes, not actually executing them<br/>`storybook automigrate --dry-run`                                                                                                                             |
| `-s`, `--skip-install`   | Skip installing dependencies whenever applicable<br/> `storybook automigrate --skip-install`                                                                                                                         |
| `-y`, `--yes`            | Skips interactive prompts and automatically accepts automigrations<br/>`storybook automigrate --yes`                                                                                                                 |
| `-l`, `--list`           | Shows a list of available automigrations<br/> `storybook automigrate --list`                                                                                                                                         |
| `--package-manager`      | Sets the package manager to use when installing the addon.<br/> Available package managers include `npm`, `yarn`, and `pnpm`<br/>`storybook automigrate --package-manager pnpm`                                      |     |
| `--renderer`             | Sets the renderer package for the framework Storybook is using.<br/> Useful for monorepo settings where multiple Storybook renderers are present in the same package.json<br/>`storybook automigrate --renderer vue` |     |
| `--debug`                | Outputs more logs in the CLI to assist debugging<br/>`storybook automigrate --debug`                                                                                                                                 |
| `--disable-telemetry`    | Disables Storybook's telemetry. Learn more about it [here](../configure/telemetry.md)<br/>`storybook automigrate --disable-telemetry`                                                                                |
| `--enable-crash-reports` | Enable sending crash reprots to Storybook's telemetry. Learn more about it [here](../configure/telemetry.md).<br/>`storybook automigrate --disable-telemetry`                                                        |

### `doctor`

Performs a health check on your Storybook project for common issues (e.g., duplicate dependencies, incompatible addons or mismatched versions) and provides suggestions on how to fix them. Applicable when [upgrading](../configure/upgrading.md#verifying-the-upgrade) Storybook versions.

```shell
storybook doctor [options]
```

Options include:

| Option                   | Description                                                                                                                                                                   |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `-c`, `--config-dir`     | Directory where to load Storybook configurations from<br/>`storybook doctor --config-dir .storybook`                                                                          |
| `--package-manager`      | Sets the package manager to use when running the health check.<br/>Available package managers include `npm`, `yarn`, and `pnpm`<br/>`storybook doctor --package-manager pnpm` |
| `--debug`                | Outputs more logs in the CLI to assist debugging<br/>`storybook doctor --debug`                                                                                               |
| `--disable-telemetry`    | Disables Storybook's telemetry. Learn more about it [here](../configure/telemetry.md)<br/>`storybook doctor --disable-telemetry`                                              |
| `--enable-crash-reports` | Enable sending crash reprots to Storybook's telemetry. Learn more about it [here](../configure/telemetry.md).<br/>`storybook doctor --disable-telemetry`                      |

### `info`

Reports useful debugging information about your environment. Helpful in providing information when opening an issue or a discussion.

```shell
storybook info
```

Example output:

```shell
Storybook Environment Info:

  System:
    OS: macOS 14.2
    CPU: (8) arm64 Apple M3
    Shell: 5.9 - /bin/zsh
  Binaries:
    Node: 18.19.0 - ~/.nvm/versions/node/v18.19.0/bin/node
    npm: 10.2.3 - ~/.nvm/versions/node/v18.19.0/bin/npm <----- active
  Browsers:
    Chrome: 120.0.6099.199
  npmPackages:
    @storybook/addon-essentials: ^7.6.6 => 7.6.6
    @storybook/addon-interactions: ^7.6.6 => 7.6.6
    @storybook/addon-links: ^7.6.6 => 7.6.6
    @storybook/addon-onboarding: ^1.0.10 => 1.0.10
    @storybook/blocks: ^7.6.6 => 7.6.6
    @storybook/preset-create-react-app: ^7.6.6 => 7.6.6
    @storybook/react: ^7.6.6 => 7.6.6
    @storybook/react-webpack5: ^7.6.6 => 7.6.6
    @storybook/test: ^7.6.6 => 7.6.6
    storybook: ^7.6.6 => 7.6.6
  npmGlobalPackages:
    chromatic: ^10.2.0 => 10.2.0
```

### `sandbox`

Generates a local sandbox project using the specified version (e.g., `@latest`, `@8`, `@next`) for testing Storybook features based on the list of supported [frameworks](../configure/frameworks.md). Useful for reproducing bugs when opening an issue or a discussion.

```shell
storybook[@version] sandbox [framework-filter] [options]
```

For example, `storybook@next sandbox` will generated sandboxes using the newest pre-release version of Storybook.

The `framework-filter` argument is optional and can filter the list of available frameworks. For example, `storybook@next sandbox react` will only offer to generate React-based sandboxes.

Options include:

| Option                      | Description                                                                                                                                               |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `-o`, `--output [dir-name]` | Configures the location of the sandbox project<br/>`storybook sandbox --output /my-sandbox-project`                                                       |
| `--no-init`                 | Generates a sandbox project without without initializing Storybook<br/>`storybook sandbox --no-init`                                                      |
| `--debug`                   | Outputs more logs in the CLI to assist debugging<br/>`storybook sandbox --debug`                                                                          |
| `--disable-telemetry`       | Disables Storybook's telemetry. Learn more about it [here](../configure/telemetry.md)<br/>`storybook sandbox --disable-telemetry`                         |
| `--enable-crash-reports`    | Enable sending crash reprots to Storybook's telemetry. Learn more about it [here](../configure/telemetry.md).<br/>`storybook sandbox --disable-telemetry` |

<Callout variant="info">

If you're looking for a hosted version of the available sandboxes, see [storybook.new](https://storybook.new).

</Callout>

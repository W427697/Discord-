```shell renderer="angular" language="js" packageManager="pnpm"
pnpm add --save-dev @storybook/angular
```

```shell renderer="angular" language="js" packageManager="pnpm"
pnpm add --save-dev @compodoc/compodoc
```

```shell renderer="common" language="js" packageManager="pnpm"
pnpm run build-storybook
```

```shell renderer="common" language="js" packageManager="pnpm"
pnpm dlx storybook@latest add @chromatic-com/storybook
```

```shell renderer="common" language="js" packageManager="pnpm"
pnpm dlx storybook@latest init --package-manager=npm
```

```shell renderer="common" language="js" packageManager="pnpm"
pnpm dlx storybook@latest init --type solid
```

```shell renderer="common" language="js" packageManager="pnpm"
pnpm dlx storybook@latest init
```

```sh renderer="common" language="js" packageManager="pnpm"
pnpm add msw msw-storybook-addon --save-dev
```

```shell renderer="common" language="js" packageManager="pnpm"
pnpm dlx msw init public/
```

```shell renderer="common" language="js" packageManager="pnpm"
pnpm dlx http-server ./path/to/build
```

```shell renderer="common" language="js" packageManager="pnpm"
pnpm add --save-dev @storybook/addon-a11y
```

```shell renderer="common" language="js" packageManager="pnpm"
pnpm dlx storybook@latest add @storybook/addon-a11y
```

```shell renderer="common" language="js" packageManager="pnpm"
pnpm add --save-dev @storybook/addon-actions
```

```sh renderer="common" language="js" packageManager="pnpm"
pnpm dlx storybook@latest add @storybook/addon-webpack5-compiler-babel
```

```sh renderer="common" language="js" packageManager="pnpm"
pnpm dlx storybook@latest add @storybook/addon-webpack5-compiler-swc
```

```shell renderer="common" language="js" packageManager="pnpm"
pnpm add --save-dev @storybook/addon-essentials
```

```shell renderer="common" language="js" packageManager="pnpm"
pnpm add --save-dev @storybook/test @storybook/addon-interactions
```

```shell renderer="common" language="js" packageManager="pnpm"
pnpm run release
```

```shell renderer="common" language="js" packageManager="pnpm"
pnpm run start
```

```shell renderer="common" language="js" packageManager="pnpm"
pnpm dlx storybook@latest automigrate
```

```shell renderer="common" language="js" packageManager="pnpm"
pnpm run build-storybook --test
```

```shell renderer="common" language="js" packageManager="pnpm"
pnpm add --save-dev @storybook/addon-coverage
```

```shell renderer="common" language="js" packageManager="pnpm"
pnpm run storybook --disable-telemetry
```

```shell renderer="common" language="js" packageManager="pnpm"
pnpm dlx storybook@latest doctor
```

```shell renderer="common" language="js" packageManager="pnpm"
pnpm dlx storybook@7.5.3 extract
```

```shell renderer="common" language="js" packageManager="pnpm"
pnpm add --save-dev @storybook/addon-designs
```

```shell renderer="common" language="js" packageManager="pnpm"
pnpm dlx storybook@^7 init
```

```sh renderer="common" language="js" packageManager="pnpm"
# Convert CSF 2 to CSF 3
pnpm dlx storybook@latest migrate csf-2-to-3 --glob="**/*.stories.tsx" --parser=tsx
```

```sh renderer="common" language="js" packageManager="pnpm"
# Convert stories in MDX to CSF
pnpm dlx storybook@latest migrate mdx-to-csf --glob "src/**/*.stories.mdx"
```

```sh renderer="common" language="js" packageManager="pnpm"
# Convert storiesOf to CSF 1
pnpm dlx storybook@latest migrate storiesof-to-csf --glob="**/*.stories.tsx" --parser=tsx
```

```shell renderer="common" language="js" packageManager="pnpm"
pnpm dlx storybook@latest remove @storybook/addon-a11y
```

```shell renderer="common" language="js" packageManager="pnpm"
pnpm run storybook
```

```shell renderer="common" language="js" packageManager="pnpm"
pnpm run storybook --enable-crash-reports
```

```shell renderer="common" language="js" packageManager="pnpm"
pnpm add --save-dev @storybook/manager-api @storybook/theming
```

```shell renderer="common" language="js" packageManager="pnpm"
pnpm dlx storybook@next upgrade
```

```shell renderer="common" language="js" packageManager="pnpm"
pnpm dlx storybook@^7 upgrade
```

```shell renderer="common" language="js" packageManager="pnpm"
pnpm dlx storybook@latest upgrade
```

```shell renderer="common" language="js" packageManager="pnpm"
pnpm add --save-dev @storybook/builder-vite
```

```shell renderer="common" language="js" packageManager="pnpm"
pnpm add --save-dev axe-playwright
```

```shell renderer="common" language="js" packageManager="pnpm"
pnpm run test-storybook --coverage
```

```shell renderer="common" language="js" packageManager="pnpm"
pnpm run test-storybook --eject
```

```shell renderer="common" language="js" packageManager="pnpm"
pnpm run test-storybook --watch
```

```shell renderer="common" language="js" packageManager="pnpm"
pnpm run test-storybook  --url https://the-storybook-url-here.com
```

```shell renderer="common" language="js" packageManager="pnpm"
pnpm run test-storybook
```

```shell renderer="common" language="js" packageManager="pnpm"
pnpm add --save-dev @storybook/test-runner
```

```shell renderer="common" language="js" packageManager="pnpm"
pnpm run test-storybook --no-index-json
```

```shell renderer="common" language="js" packageManager="pnpm"
pnpm run test-storybook --index-json
```

```shell renderer="common" language="js" packageManager="pnpm"
pnpm dlx storybook@7.6.6 upgrade
```

```shell renderer="react" language="js" packageManager="pnpm"
pnpm add --save-dev @storybook/nextjs
```

```shell renderer="react" language="js" packageManager="pnpm"
pnpm add --save-dev @storybook/react-vite
```

```shell renderer="react" language="js" packageManager="pnpm"
pnpm add --save-dev @storybook/react-webpack5
```

```shell renderer="svelte" language="js" packageManager="pnpm"
pnpm dlx storybook@latest add @storybook/addon-svelte-csf
```

```shell renderer="svelte" language="js" packageManager="pnpm"
pnpm add --save-dev @storybook/svelte-vite
```

```shell renderer="svelte" language="js" packageManager="pnpm"
pnpm add --save-dev @storybook/svelte-webpack5
```

```shell renderer="svelte" language="js" packageManager="pnpm"
pnpm add --save-dev @storybook/sveltekit
```

```shell renderer="vue" language="js" packageManager="pnpm"
pnpm add --save-dev @storybook/vue3-vite
```

```shell renderer="vue" language="js" packageManager="pnpm"
pnpm add --save-dev @storybook/vue3-webpack5
```

```shell renderer="web-components" language="js" packageManager="pnpm"
pnpm add --save-dev @storybook/web-components-vite
```

```shell renderer="web-components" language="js" packageManager="pnpm"
pnpm add --save-dev @storybook/web-components-webpack5
```


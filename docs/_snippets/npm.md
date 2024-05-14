```shell renderer="angular" language="js" packageManager="npm"
npm install --save-dev @storybook/angular
```

```shell renderer="angular" language="js" packageManager="npm"
npm install @compodoc/compodoc --save-dev
```

```shell renderer="common" language="js" packageManager="npm"
npm run build-storybook
```

```shell renderer="common" language="js" packageManager="npm"
npm install chromatic --save-dev
```

```shell renderer="common" language="js" packageManager="npm"
npx storybook@latest add @chromatic-com/storybook
```

```sh renderer="common" language="js" packageManager="npm"
npm install msw msw-storybook-addon --save-dev
```

```shell renderer="common" language="js" packageManager="npm"
npx http-server ./path/to/build
```

```shell renderer="common" language="js" packageManager="npm"
npm install @storybook/addon-a11y --save-dev
```

```shell renderer="common" language="js" packageManager="npm"
npx storybook@latest add @storybook/addon-a11y
```

```shell renderer="common" language="js" packageManager="npm"
npm install @storybook/addon-actions --save-dev
```

```sh renderer="common" language="js" packageManager="npm"
npx storybook@latest add @storybook/addon-webpack5-compiler-babel
```

```sh renderer="common" language="js" packageManager="npm"
npx storybook@latest add @storybook/addon-webpack5-compiler-swc
```

```shell renderer="common" language="js" packageManager="npm"
npm install @storybook/addon-essentials --save-dev
```

```shell renderer="common" language="js" packageManager="npm"
npm install @storybook/test @storybook/addon-interactions --save-dev
```

```shell renderer="common" language="js" packageManager="npm"
npm run release
```

```sh renderer="common" language="js" packageManager="npm"
npm run start
```

```shell renderer="common" language="js" packageManager="npm"
npx storybook@latest automigrate
```

```shell renderer="common" language="js" packageManager="npm"
npm run build-storybook -- --test
```

```shell renderer="common" language="js" packageManager="npm"
npm install @storybook/addon-coverage --save-dev
```

```shell renderer="common" language="js" packageManager="npm"
npm run storybook -- --debug-webpack
```

```shell renderer="common" language="js" packageManager="npm"
npm run build-storybook -- --debug-webpack
```

```shell renderer="common" language="js" packageManager="npm"
npm run storybook -- --disable-telemetry
```

```shell renderer="common" language="js" packageManager="npm"
npx storybook@latest doctor
```

```shell renderer="common" language="js" packageManager="npm"
npm install --save-dev @storybook/addon-designs
```

```sh renderer="common" language="js" packageManager="npm"
# Convert CSF 2 to CSF 3
npx storybook@latest migrate csf-2-to-3 --glob="**/*.stories.tsx" --parser=tsx
```

```shell renderer="common" language="js" packageManager="npm"
# Convert stories in MDX to CSF
npx storybook@latest migrate mdx-to-csf --glob "src/**/*.stories.mdx"
```

```sh renderer="common" language="js" packageManager="npm"
# Convert storiesOf to CSF 1
npx storybook@latest migrate storiesof-to-csf --glob="**/*.stories.tsx" --parser=tsx
```

```shell renderer="common" language="js" packageManager="npm"
npx storybook@latest remove @storybook/addon-a11y
```

```shell renderer="common" language="js" packageManager="npm"
npm run storybook
```

```shell renderer="common" language="js" packageManager="npm"
STORYBOOK_TELEMETRY_DEBUG=1 npm run storybook
```

```shell renderer="common" language="js" packageManager="npm"
npm run storybook -- --enable-crash-reports
```

```shell renderer="common" language="js" packageManager="npm"
npm install --save-dev @storybook/testing-( react | vue | vue3 | angular)
```

```shell renderer="common" language="js" packageManager="npm"
npm install --save-dev @storybook/manager-api @storybook/theming
```

```shell renderer="common" language="js" packageManager="npm"
npx storybook@next upgrade
```

```shell renderer="common" language="js" packageManager="npm"
npx storybook@^7 upgrade
```

```shell renderer="common" language="js" packageManager="npm"
npx storybook@latest upgrade
```

```shell renderer="common" language="js" packageManager="npm"
npm install @storybook/builder-vite --save-dev
```

```shell renderer="common" language="js" packageManager="npm"
npm install axe-playwright --save-dev
```

```shell renderer="common" language="js" packageManager="npm"
npm run test-storybook -- --coverage
```

```sh renderer="common" language="js" packageManager="npm"
npm run test-storybook -- --eject
```

```shell renderer="common" language="js" packageManager="npm"
npm run test-storybook -- --watch
```

```shell renderer="common" language="js" packageManager="npm"
npm run test-storybook -- --url https://the-storybook-url-here.com
```

```shell renderer="common" language="js" packageManager="npm"
npm run test-storybook
```

```shell renderer="common" language="js" packageManager="npm"
npm install @storybook/test-runner --save-dev
```

```shell renderer="common" language="js" packageManager="npm"
npm run test-storybook -- --no-index-json
```

```shell renderer="common" language="js" packageManager="npm"
npm run test-storybook -- --index-json
```

```shell renderer="react" language="js" packageManager="npm"
npm install --save-dev @storybook/nextjs
```

```shell renderer="react" language="js" packageManager="npm"
npm install --save-dev @storybook/react-vite
```

```shell renderer="react" language="js" packageManager="npm"
npm install --save-dev @storybook/react-webpack5
```

```shell renderer="svelte" language="js" packageManager="npm"
npx storybook@latest add @storybook/addon-svelte-csf
```

```shell renderer="svelte" language="js" packageManager="npm"
npm install --save-dev @storybook/svelte-vite
```

```shell renderer="svelte" language="js" packageManager="npm"
npm install --save-dev @storybook/svelte-webpack5
```

```shell renderer="svelte" language="js" packageManager="npm"
npm install --save-dev @storybook/sveltekit
```

```shell renderer="vue" language="js" packageManager="npm"
npm install --save-dev @storybook/vue3-vite
```

```shell renderer="vue" language="js" packageManager="npm"
npm install --save-dev @storybook/vue3-webpack5
```

```shell renderer="web-components" language="js" packageManager="npm"
npm install --save-dev @storybook/web-components-vite
```

```shell renderer="web-components" language="js" packageManager="npm"
npm install --save-dev @storybook/web-components-webpack5
```


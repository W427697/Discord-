```yml renderer="common" language="ts" tabTitle="yml"
# .github/workflows/deploy-github-pages.yaml

# Workflow name
name: Build and Publish Storybook to GitHub Pages

on:
  # Event for the workflow to run on
  push:
    branches:
      - 'your-branch-name' # Replace with the branch you want to deploy from

permissions:
  contents: read
  pages: write
  id-token: write

# List of jobs
jobs:
  deploy:
    runs-on: ubuntu-latest
    # Job steps
    steps:
      # Manual Checkout
      - uses: actions/checkout@v4

      # Set up Node
      - uses: actions/setup-node@v4
        with:
          node-version: '16.x'

      #👇 Add Storybook build and deploy to GitHub Pages as a step in the workflow
      - uses: bitovi/github-actions-storybook-to-github-pages@v1.0.1
        with:
          install_command: yarn install # default: npm ci
          build_command: yarn build-storybook # default: npm run build-storybook
          path: storybook-static # default: dist/storybook
          checkout: false # default: true
```

```yml renderer="common" language="ts" tabTitle="yml"
# .github/workflows/storybook-tests.yml

name: 'Storybook Tests'
on: push
jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version-file: '.nvmrc'
      - name: Install dependencies
        run: yarn
      - name: Install Playwright
        run: npx playwright install --with-deps
      - name: Build Storybook
        run: yarn build-storybook --quiet
      - name: Serve Storybook and run tests
        run: |
          npx concurrently -k -s first -n "SB,TEST" -c "magenta,blue" \
            "npx http-server storybook-static --port 6006 --silent" \
            "npx wait-on tcp:6006 && yarn test-storybook"
```

```yml renderer="common" language="ts" tabTitle="yml"
# .github/workflows/storybook-tests.yml

name: Storybook Tests
on: deployment_status
jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    if: github.event.deployment_status.state == 'success'
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version-file: '.nvmrc'
      - name: Install dependencies
        run: yarn
      - name: Install Playwright
        run: npx playwright install --with-deps
      - name: Run Storybook tests
        run: yarn test-storybook
        env:
          TARGET_URL: '${{ github.event.deployment_status.target_url }}'
```


# Storybook Coverage

Storybook coverage visualizes "story coverage", or which component states are not adequately represented by stories.

To generate coverage.json:

```
yarn jest --testPathPattern=examples/official-storybook/tests/storyshots.test.js --coverage --coverageReporters=json
```

To make this usable:

- [ ] Addon API for treeview rendering?
- [ ] Run coverage in watch mode
- [ ] Load JSON file in preview & send across channel (vs. hardcoded in manager)
- [ ] Associate stories with components & components with files (in a loader? => params.componentFilePath?)
- [ ] Find a better way to manage global state (redux? mobx?) and/or force redraw treeview
- [ ] Treat un-analyzed files as zero coverage
- [ ] Explain coverage data in addon-panel
- [ ] Fix color scheme

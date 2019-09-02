# Storybook Coverage

Storybook coverage visualizes "story coverage", or which component states are not adequately represented by stories.

How it works:

- Jest/storyshots generates coverage file that maps `filename` to `coverage`
- Docgen loader adds `filename` to `__docgenInfo` for each component
- Addon-coverage maps story to `component` parameter to `filename` to `coverage`

UI:

- Toolbar button selects coverage summmary type (statement, branch, etc.)
- Nav tree view visualizes `CoverageSummary` (storyId + type => number for all stories)
- Coverage panel visualizes `CoverageDetail` (summary numbers + file source)

To generate coverage.json:

```
yarn jest --testPathPattern=examples/official-storybook/tests/storyshots.test.js --coverage --coverageReporters=json --watch
```

Modify `babel-plugin-react-docgen`:

```js
docgenResults = ReactDocgen.parse(code, resolver, handlers);
docgenResults.forEach(r => (r.filename = state.filename));
```

Add this to `config.js` **AFTER configure**:

```
import { storyCoverage, storyMap, EVENTS } from '@storybook/addon-coverage';
import coverageMap from '../../coverage/coverage-final.json';

...

const channel = addons.getChannel();
const coverage = coverageSummary(coverageMap, storyMap(window.__STORYBOOK_STORY_STORE__));
channel.emit(EVENTS.COVERAGE_SUMMARY, coverage);

function getContext(store) {
  const { storyId } = store.getSelection();
  return store.fromId(storyId);
}

const context = getContext(window.__STORYBOOK_STORY_STORE__);
if (context) {
  channel.emit(EVENTS.COVERAGE_DETAIL, coverageDetail(context));
}
```

To make this usable:

- [ ] Addon API for treeview rendering?
- [ ] Run coverage in watch mode
- [ ] Load JSON file in preview & send across channel (vs. hardcoded in manager)
- [ ] Display results summary in coverage panel
- [x] Simplifying assumption that Component.stories.js maps to Component.js in the same director
- [x] Associate stories with components & components with files (in a loader? => params.componentFilePath?)
- [ ] Find a better way to manage global state (redux? mobx?) and/or force redraw treeview
- [ ] Treat un-analyzed files as zero coverage
- [ ] Explain coverage data in addon-panel
- [ ] Fix color scheme

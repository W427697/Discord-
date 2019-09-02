# Storybook Coverage

Storybook coverage visualizes "story coverage", or which component states are not adequately represented by stories.

How it works:

- Jest/storyshots generates coverage file that maps `filename` to `coverage`
- Docgen loader adds `filename` to `__docgenInfo` for each component
- Addon-coverage maps story to `component` parameter to `filename` to `coverage`

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

const coverage = storyCoverage(coverageMap, storyMap(window.__STORYBOOK_STORY_STORE__));
// console.log('loaded', { coverageMap, coverage });
addParameters({ coverage });

const channel = addons.getChannel();
channel.emit(EVENTS.COVERAGE, coverage);
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

import { addons } from '@storybook/manager-api';
import { global } from '@storybook/global';

const STATIC_FILTER = 'static-filter';

const excludeTags = Object.entries(global.TAGS_OPTIONS).reduce((acc, entry) => {
  const [tag, option] = entry;
  if ((option as any).excludeFromSidebar) {
    acc[tag] = true;
  }
  return acc;
}, {} as Record<string, boolean>);

addons.register(STATIC_FILTER, (api) => {
  api.experimental_setFilter(STATIC_FILTER, (item) => {
    const tags = item.tags || [];
    // very strange behavior here. Auto-generated docs entries get
    // the tags of the primary story by default, so if that story
    // happens to be `docs-only`, then filtering it out of the sidebar
    // ALSO filter out the sidebar entry, which is not what we want.
    // Here we special case it, but there should be a better solution.
    return tags.includes('docs') || tags.filter((tag) => excludeTags[tag]).length === 0;
  });
});

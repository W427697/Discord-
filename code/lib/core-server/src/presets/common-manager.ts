import { addons } from '@storybook/manager-api';
import { global } from '@storybook/global';

const STATIC_FILTER = 'static-filter';

const excludeTags = Object.entries(global.TAGS_OPTIONS ?? {}).reduce((acc, entry) => {
  const [tag, option] = entry;
  if ((option as any).excludeFromSidebar) {
    acc[tag] = true;
  }
  return acc;
}, {} as Record<string, boolean>);

addons.register(STATIC_FILTER, (api) => {
  api.experimental_setFilter(STATIC_FILTER, (item) => {
    const tags = item.tags || [];
    return tags.filter((tag) => excludeTags[tag]).length === 0;
  });
});

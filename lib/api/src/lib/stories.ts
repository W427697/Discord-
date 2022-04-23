import memoize from 'memoizerific';
import React from 'react';
import deprecate from 'util-deprecate';
import dedent from 'ts-dedent';
import mapValues from 'lodash/mapValues';
import global from 'global';
import type {
  StoryId,
  ComponentTitle,
  StoryKind,
  StoryName,
  Args,
  ArgTypes,
  Parameters,
} from '@storybook/csf';
import { sanitize } from '@storybook/csf';

import { combineParameters } from '../index';
import merge from './merge';
import type { Provider } from '../modules/provider';
import type { ViewMode } from '../modules/addons';

const { FEATURES } = global;

export type { StoryId };

export interface Root {
  id: StoryId;
  depth: 0;
  name: string;
  refId?: string;
  children: StoryId[];
  isComponent: false;
  isRoot: true;
  isLeaf: false;
  renderLabel?: (item: Root) => React.ReactNode;
  startCollapsed?: boolean;
}

export interface Group {
  id: StoryId;
  depth: number;
  name: string;
  children: StoryId[];
  refId?: string;
  parent?: StoryId;
  isComponent: boolean;
  isRoot: false;
  isLeaf: boolean;
  renderLabel?: (item: Group) => React.ReactNode;
  // MDX docs-only stories are "Group" type
  parameters?: {
    viewMode?: ViewMode;
  };
}

export interface Story {
  id: StoryId;
  depth: number;
  parent: StoryId;
  name: string;
  title: StoryKind;
  importPath: Path;
  refId?: string;
  children?: StoryId[];
  isComponent: false;
  isRoot: false;
  isLeaf: true;
  renderLabel?: (item: Story) => React.ReactNode;
  prepared: boolean;
  parameters?: {
    [parameterName: string]: any;
  };
  args?: Args;
  argTypes?: ArgTypes;
  initialArgs?: Args;
}

// This is what we use for our sidebar
export interface StoriesHash {
  [id: string]: Root | Group | Story;
}

// The data received on the (legacy) `setStories` event
export interface SetStoriesStory {
  id: StoryId;
  name: string;
  refId?: string;
  kind: StoryKind;
  parameters: {
    fileName: string;
    options: {
      [optionName: string]: any;
    };
    docsOnly?: boolean;
    viewMode?: ViewMode;
    [parameterName: string]: any;
  };
  argTypes?: ArgTypes;
  args?: Args;
  initialArgs?: Args;
}

export interface SetStoriesStoryData {
  [id: string]: SetStoriesStory;
}

export type SetStoriesPayload =
  | {
      v: 2;
      error?: Error;
      globals: Args;
      globalParameters: Parameters;
      stories: SetStoriesStoryData;
      kindParameters: {
        [kind: string]: Parameters;
      };
    }
  | ({
      v?: number;
      stories: SetStoriesStoryData;
    } & Record<string, never>);

// The data recevied via the story index
type Path = string;
export interface StoryIndexEntry {
  id: StoryId;
  name: StoryName;
  title: ComponentTitle;
  importPath: Path;
  type?: 'story' | 'docs';
}

export interface StoryIndexV3 {
  v: 3;
  stories: Record<StoryId, StoryIndexEntry>;
}

export interface StoryIndex {
  v: number;
  entries: Record<StoryId, StoryIndexEntry>;
}

const warnLegacyShowRoots = deprecate(
  () => {},
  dedent`
    The 'showRoots' config option is deprecated and will be removed in Storybook 7.0. Use 'sidebar.showRoots' instead.
    Read more about it in the migration guide: https://github.com/storybookjs/storybook/blob/master/MIGRATION.md
  `
);

const warnChangedDefaultHierarchySeparators = deprecate(
  () => {},
  dedent`
    The default hierarchy separators changed in Storybook 6.0.
    '|' and '.' will no longer create a hierarchy, but codemods are available.
    Read more about it in the migration guide: https://github.com/storybookjs/storybook/blob/master/MIGRATION.md
  `
);

export const denormalizeStoryParameters = ({
  globalParameters,
  kindParameters,
  stories,
}: SetStoriesPayload): SetStoriesStoryData => {
  return mapValues(stories, (storyData) => ({
    ...storyData,
    parameters: combineParameters(
      globalParameters,
      kindParameters[storyData.kind],
      storyData.parameters as unknown as Parameters
    ),
  }));
};

const TITLE_PATH_SEPARATOR = /\s*\/\s*/;

// We used to received a bit more data over the channel on the SET_STORIES event, including
// the full parameters for each story.
type PreparedStoryIndexEntry = StoryIndexEntry & {
  parameters?: Parameters;
  argTypes?: ArgTypes;
  args?: Args;
  initialArgs?: Args;
};
export interface PreparedStoryIndex {
  v: number;
  entries: Record<StoryId, PreparedStoryIndexEntry>;
}

export const transformSetStoriesStoryDataToStoriesHash = (
  data: SetStoriesStoryData,
  { provider }: { provider: Provider }
) =>
  transformStoryIndexToStoriesHash(transformSetStoriesStoryDataToPreparedStoryIndex(data), {
    provider,
  });

const transformSetStoriesStoryDataToPreparedStoryIndex = (
  stories: SetStoriesStoryData
): PreparedStoryIndex => {
  const entries: PreparedStoryIndex['entries'] = Object.entries(stories).reduce(
    (acc, [id, story]) => {
      if (!story) return acc;

      const { docsOnly, fileName, ...parameters } = story.parameters;
      const base = {
        title: story.kind,
        id,
        name: story.name,
        importPath: fileName,
      };
      if (docsOnly) {
        acc[id] = {
          type: 'docs',
          ...base,
        };
      } else {
        const { argTypes, args, initialArgs } = story;
        acc[id] = {
          type: 'story',
          ...base,
          parameters,
          argTypes,
          args,
          initialArgs,
        };
      }
      return acc;
    },
    {} as PreparedStoryIndex['entries']
  );

  return { v: 4, entries };
};

export const transformStoryIndexToStoriesHash = (
  index: PreparedStoryIndex,
  {
    provider,
  }: {
    provider: Provider;
  }
): StoriesHash => {
  const entryValues = Object.values(index.entries);
  const { sidebar = {}, showRoots: deprecatedShowRoots } = provider.getConfig();
  const { showRoots = deprecatedShowRoots, collapsedRoots = [], renderLabel } = sidebar;
  const usesOldHierarchySeparator = entryValues.some(({ title }) => title.match(/\.|\|/)); // dot or pipe
  if (typeof deprecatedShowRoots !== 'undefined') {
    warnLegacyShowRoots();
  }

  const setShowRoots = typeof showRoots !== 'undefined';
  if (usesOldHierarchySeparator && !setShowRoots && FEATURES?.warnOnLegacyHierarchySeparator) {
    warnChangedDefaultHierarchySeparators();
  }

  const storiesHashOutOfOrder = Object.values(entryValues).reduce((acc, item) => {
    // First, split the title into parts, and create an id for each part
    const { type, title } = item;
    const groups = title.trim().split(TITLE_PATH_SEPARATOR);
    const root = (!setShowRoots || showRoots) && groups.length > 1 ? [groups.shift()] : [];

    const names = [...root, ...groups];
    const paths = names.reduce((list, name, idx) => {
      const parent = idx > 0 && list[idx - 1];
      const id = sanitize(parent ? `${parent}-${name}` : name);

      if (parent === id) {
        throw new Error(
          dedent`
          Invalid part '${name}', leading to id === parentId ('${id}'), inside title '${title}'
          
          Did you create a path that uses the separator char accidentally, such as 'Vue <docs/>' where '/' is a separator char? See https://github.com/storybookjs/storybook/issues/6128
          `
        );
      }
      list.push(id);
      return list;
    }, [] as string[]);

    // Now, let's add an entry to the hash for each path
    paths.forEach((id, idx) => {
      // The child is the next path, OR the story itself; unless this is a docs entry
      const childId = paths[idx + 1] || (type !== 'docs' && item.id);

      if (root.length && idx === 0) {
        acc[id] = merge(acc[id] || {}, {
          id,
          name: names[idx],
          depth: idx,
          renderLabel,
          startCollapsed: collapsedRoots.includes(id),
          // Note that this will get appended tothe previous list of children if this entry
          // already exists (i.e. we've seen this root before)
          children: [childId],
          isRoot: true,
          isComponent: false,
          isLeaf: false,
        });
      } else {
        const isComponent = acc[id]?.isComponent !== false && idx === paths.length - 1;
        const isLeaf = isComponent && type === 'docs';
        acc[id] = merge(acc[id] || {}, {
          id,
          name: names[idx],
          parent: paths[idx - 1],
          depth: idx,
          renderLabel,
          ...(childId && {
            children: [childId],
          }),
          isRoot: false,
          isComponent,
          isLeaf,
        });
      }
    });

    if (type !== 'docs') {
      acc[item.id] = {
        ...item,
        depth: paths.length,
        parent: paths[paths.length - 1],
        renderLabel,
        prepared: !!item.parameters,
        isRoot: false,
        isComponent: false,
        isLeaf: true,
      };
    }

    return acc;
  }, {} as StoriesHash);

  function addItem(acc: StoriesHash, item: Story | Group) {
    if (!acc[item.id]) {
      // If we were already inserted as part of a group, that's great.
      acc[item.id] = item;
      const { children } = item;
      if (children) {
        const childNodes = children.map((id) => storiesHashOutOfOrder[id]) as (Story | Group)[];
        acc[item.id].isComponent = childNodes.every((childNode) => childNode.isLeaf);
        childNodes.forEach((childNode) => addItem(acc, childNode));
      }
    }
    return acc;
  }

  return Object.values(storiesHashOutOfOrder).reduce(addItem, {});
};

export type Item = StoriesHash[keyof StoriesHash];

export function isRoot(item: Item): item is Root {
  if (item as Root) {
    return item.isRoot;
  }
  return false;
}
export function isGroup(item: Item): item is Group {
  if (item as Group) {
    return !item.isRoot && !item.isLeaf;
  }
  return false;
}
export function isStory(item: Item): item is Story {
  if (item as Story) {
    return item.isLeaf;
  }
  return false;
}

export const getComponentLookupList = memoize(1)((hash: StoriesHash) => {
  return Object.entries(hash).reduce((acc, i) => {
    const value = i[1];
    if (value.isComponent) {
      acc.push([...i[1].children]);
    }
    return acc;
  }, [] as StoryId[][]);
});

export const getStoriesLookupList = memoize(1)((hash: StoriesHash) => {
  return Object.keys(hash).filter((k) => !(hash[k].children || Array.isArray(hash[k])));
});

import type {
  ComponentEntry,
  GroupEntry,
  HashEntry,
  RootEntry,
  StoriesHash,
  StoryEntry,
} from '@storybook/api';
import { Item } from './types';

export const DEFAULT_REF_ID = 'storybook_internal';

export const collapseAllStories = (stories: StoriesHash) => {
  // keep track of component IDs that have been rewritten to the ID of their first leaf child
  const componentIdToLeafId: Record<string, string> = {};

  // 1) remove all leaves
  const leavesRemoved = Object.values(stories).filter(
    (item: HashEntry) =>
      !(
        (item.type === 'story' || item.type === 'docs') &&
        stories[item.parent].type === 'component'
      )
  );

  // 2) make all components leaves and rewrite their ID's to the first leaf child
  const componentsFlattened = leavesRemoved.map((item: HashEntry) => {
    // this is a folder, so just leave it alone
    if (item.type !== 'component') {
      return item;
    }

    const { id, children, ...rest } = item;

    const nonLeafChildren: string[] = [];
    const leafChildren: string[] = [];
    children.forEach((child: string) =>
      (['stories', 'docs'].includes(stories[child].type) ? leafChildren : nonLeafChildren).push(
        child
      )
    );

    if (leafChildren.length === 0) {
      return item; // pass through, we'll handle you later
    }

    const leafId = leafChildren[0];
    const component = {
      type: 'story',
      args: {},
      ...rest,
      id: leafId,
      title: (stories[leafId] as StoryEntry).title,
      children: [] as string[],
    };
    componentIdToLeafId[id] = leafId;

    // this is a component, so it should not have any non-leaf children
    if (nonLeafChildren.length !== 0) {
      throw new Error(`Unexpected '${item.id}': ${JSON.stringify({ nonLeafChildren })}`);
    }

    return component;
  });

  // 3) rewrite all the children as needed
  const childrenRewritten = componentsFlattened.map((item) => {
    if (item.type === 'story' || item.type === 'docs') {
      return item;
    }

    const { children, ...rest } = item;
    const rewritten = children.map((child: string) => componentIdToLeafId[child] || child);

    return { children: rewritten, ...rest };
  });

  const result = {} as StoriesHash;
  childrenRewritten.forEach((item) => {
    result[item.id] = item as Item;
  });
  return result;
};

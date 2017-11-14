function findMatches(matches, type, value) {
  if (!matches) {
    return null;
  }

  const matchForType = matches
    .filter(match => match.key === type)
    .find(match => match.value === value);

  if (!matchForType) {
    return null;
  }

  return matchForType.indices;
}

function sortMap(map) {
  return new Map([...map.entries()].sort());
}

function createNamespaceNode(namespace, hierarchy, story) {
  return {
    isNamespace: true,
    name: namespace,
    namespaces: [...hierarchy.namespaces, namespace],
    highlight: findMatches(story.matches, 'namespaces', namespace),
    map: new Map(),
  };
}

function fillHierarchy(namespaces, hierarchy, story) {
  const namespace = namespaces[0];
  const sortedHierarchy = hierarchy;
  sortedHierarchy.map = sortMap(sortedHierarchy.map);
  let childHierarchy = sortedHierarchy.map.get(namespace);

  if (!childHierarchy) {
    childHierarchy = createNamespaceNode(namespace, sortedHierarchy, story);
    sortedHierarchy.map.set(namespace, childHierarchy);
    sortedHierarchy.map = sortMap(sortedHierarchy.map);
  }

  if (namespaces.length === 1) {
    childHierarchy.kind = story.kind;
    childHierarchy.stories = story.stories.map(s => ({
      name: s,
      highlight: findMatches(story.matches, 'stories', s),
    }));

    return;
  }

  fillHierarchy(namespaces.slice(1), childHierarchy, story);
}

function sortStories(stories) {
  return stories.map(story => ({
    ...story,
    stories: story.stories.sort(),
  }));
}

export function createHierarchy(stories) {
  const hierarchyRoot = {
    isNamespace: true,
    namespaces: [],
    name: '',
    map: new Map(),
  };

  if (stories) {
    sortStories(stories).forEach(story => {
      const { namespaces } = story;
      const name = namespaces[namespaces.length - 1];

      fillHierarchy(namespaces, hierarchyRoot, { ...story, name });
    });
  }

  return hierarchyRoot;
}

export function resolveStoryHierarchy(storyName = '', hierarchySeparator) {
  if (!hierarchySeparator) {
    return [storyName];
  }

  return storyName.split(new RegExp(hierarchySeparator));
}

export function prepareStoriesForHierarchy(stories, hierarchySeparator) {
  if (!stories) {
    return null;
  }

  return stories.map(story => {
    const namespaces = resolveStoryHierarchy(story.kind, hierarchySeparator);

    return {
      ...story,
      namespaces,
    };
  });
}

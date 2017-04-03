let cnt = 0;

function getId() {
  cnt += 1;
  return cnt;
}

export default class StoryStore {
  constructor() {
    this._data = {};
    this._kindOrdering = (a, b) => (a.index - b.index);
    this._storiesOrdering = (a, b) => (a.index - b.index);
  }

  setKindOrdering(fn) {
    this._kindOrdering = fn;
  }

  setStoriesOrdering(fn) {
    this._storiesOrdering = fn;
  }

  addStory(kindConfig, name, story) {
    const { name: kindName, ...meta } = kindConfig;

    if (!this._data[kindName]) {
      this._data[kindName] = {
        kind: kindName,
        meta,
        index: getId(),
        stories: {},
      };
    }

    this._data[kindName].stories[name] = {
      name,
      index: getId(),
      meta: story.storyMeta,
      fn: story.storyFn,
    };
  }

  getStoryKinds() {
    return Object.keys(this._data)
      .map(key => this._data[key])
      .filter(kind => Object.keys(kind.stories).length > 0)
      .sort(this._kindOrdering)
      .map(info => info.kind);
  }

  getStories(kind) {
    if (!this._data[kind]) {
      return [];
    }

    return Object.keys(this._data[kind].stories)
      .map(name => this._data[kind].stories[name])
      .sort(this._storiesOrdering)
      .map(info => info.name);
  }

  getStory(kind, name) {
    const storiesKind = this._data[kind];
    if (!storiesKind) {
      return null;
    }

    const storyInfo = storiesKind.stories[name];
    if (!storyInfo) {
      return null;
    }

    return storyInfo.fn;
  }

  removeStoryKind(kindName) {
    this._data[kindName].stories = {};
  }

  hasStoryKind(kind) {
    return Boolean(this._data[kind]);
  }

  hasStory(kind, name) {
    return Boolean(this.getStory(kind, name));
  }

  dumpStoryBook() {
    const data = this.getStoryKinds()
      .map(kind => ({ kind, stories: this.getStories(kind) }));

    return data;
  }

  size() {
    return Object.keys(this._data).length;
  }

  clean() {
    this.getStoryKinds().forEach(kind => delete this._data[kind]);
  }
}

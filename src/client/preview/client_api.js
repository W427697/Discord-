function isFunction(obj) {
  return !!(obj && obj.constructor && obj.call && obj.apply);
}

export default class ClientApi {
  constructor({ channel, storyStore }) {
    // channel can be null when running in node
    // always check whether channel is available
    this._channel = channel;
    this._storyStore = storyStore;
    this._addons = {};
    this._globalDecorators = [];
  }

  setAddon(addon) {
    this._addons = {
      ...this._addons,
      ...addon,
    };
  }

  setKindOrdering(fn) {
    this._storyStore.setKindOrdering(fn);
  }

  setStoriesOrdering(fn) {
    this._storyStore.setStoriesOrdering(fn);
  }

  addDecorator(decorator) {
    this._globalDecorators.push(decorator);
  }

  clearDecorators() {
    this._globalDecorators = [];
  }

  storiesOf(kind, m) {
    if (!kind && typeof kind !== 'string' && !{}.prototype.hasOwnProperty.call(kind, 'name')) {
      throw new Error('Invalid kind provided for stories, should be a string or object with a "name" property');
    }
    let kindName;
    let kindConfig;

    if (typeof kind === 'string') {
      kindName = kind;
      kindConfig = { name: kind };
    } else {
      kindName = kind.name;
      kindConfig = kind;
    }

    if (m && m.hot) {
      m.hot.dispose(() => {
        this._storyStore.removeStoryKind(kindName);
      });
    }

    const localDecorators = [];
    const api = {
      kind: kindName,
    };

    // apply addons
    Object.keys(this._addons).forEach((name) => {
      const addon = this._addons[name];
      api[name] = (...args) => {
        addon.apply(api, args);
        return api;
      };
    });

    api.add = (storyName, getStory) => {
      if (this._storyStore.hasStory(kindName, storyName)) {
        throw new Error(`Story of "${kindName}" named "${storyName}" already exists`);
      }

      // Wrap the getStory function with each decorator. The first
      // decorator will wrap the story function. The second will
      // wrap the first decorator and so on.
      let storyFn;
      let storyMeta;
      if (isFunction(getStory)) {
        storyFn = getStory;
        storyMeta = {};
      } else {
        storyFn = getStory.story;
        storyMeta = { ...getStory };
        delete storyMeta.story;
      }
      const decorators = [
        ...localDecorators,
        ...this._globalDecorators,
      ];

      const fn = decorators.reduce((decorated, decorator) => {
        return (context) => {
          return decorator(() => {
            return decorated(context);
          }, context);
        };
      }, storyFn);

      // Add the fully decorated getStory function.
      this._storyStore.addStory(kindConfig, storyName, { storyFn: fn, storyMeta });
      return api;
    };

    api.addDecorator = (decorator) => {
      localDecorators.push(decorator);
      return api;
    };

    return api;
  }

  getStorybook() {
    return this._storyStore.getStoryKinds().map((kind) => {
      const stories = this._storyStore.getStories(kind).map((name) => {
        const render = this._storyStore.getStory(kind, name);
        return { name, render };
      });
      return { kind, stories };
    });
  }
}

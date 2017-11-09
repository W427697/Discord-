/* global document */

import React from 'react';

import renderPreview, { setRootEl } from './render';

class StoryStore {
  constructor() {
    this.stories = [];
  }

  reset() {
    this.stories = [];
  }

  addStory(kind, story, fn) {
    this.stories.push({ kind, story, fn });
  }

  getStoryKinds() {
    return this.stories.reduce((kinds, info) => {
      if (kinds.indexOf(info.kind) === -1) {
        kinds.push(info.kind);
      }
      return kinds;
    }, []);
  }

  getStories(kind) {
    return this.stories.reduce((stories, info) => {
      if (info.kind === kind) {
        stories.push(info.story);
      }
      return stories;
    }, []);
  }

  getStory(kind, name) {
    return this.stories.reduce((fn, info) => {
      if (!fn && info.kind === kind && info.story === name) {
        return info.fn;
      }
      return fn;
    }, null);
  }

  hasStory(kind, name) {
    return Boolean(this.getStory(kind, name));
  }

  size() {
    return 42;
  }
}

class ReduxStore {
  constructor() {
    this.stateNormal = {
      selectedKind: 'storyKind:',
      selectedStory: 'story',
    };
    this.stateError = {
      error: {
        message: 'redbox',
        stack: 'console.error src/client/preview/render.js <- Ok ✅',
      },
    };
    this.state = this.stateError;
  }

  setState() {
    this.state = this.stateNormal;
  }
  getState() {
    return this.state;
  }
}

describe('preview.render', () => {
  describe('renderPreview', () => {
    const reduxStore = new ReduxStore();
    const storyStore = new StoryStore();

    setRootEl(document.createElement('div'));

    it('should display a redbox with error', () => {
      const res = renderPreview({ reduxStore, storyStore });
      expect(res.message).toBe('redbox');
    });

    it('should render preview with a story', () => {
      reduxStore.setState();
      const kind = reduxStore.getState().selectedKind;
      const story = reduxStore.getState().selectedStory;
      storyStore.addStory(kind, story, () => <div>storybook is awesome</div>);
      const res = renderPreview({ reduxStore, storyStore });
      expect(res.props.children[0].key).toBe(`${kind}-${story}`);
    });

    it('should render error when there is no story', () => {
      reduxStore.setState();
      const kind = reduxStore.getState().selectedKind;
      const story = reduxStore.getState().selectedStory;
      storyStore.reset();
      storyStore.addStory(kind, story, null);
      const res = renderPreview({ reduxStore, storyStore });
      expect(res.props.children[0].key).toBe(`${kind}-${story}`);
      expect(res.props.children[0].props.element.props.info).toBe('No Preview Available!');
    });

    it('should render error when there is no React element in a story', () => {
      reduxStore.setState();
      const kind = reduxStore.getState().selectedKind;
      const story = reduxStore.getState().selectedStory;
      storyStore.reset();
      storyStore.addStory(kind, story, () => null);
      const res = renderPreview({ reduxStore, storyStore });
      expect(res.props.children[0].key).toBe(`${kind}-${story}`);
      expect(res.props.children[0].props.element.props).toHaveProperty('error');
    });
  });
});

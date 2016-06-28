import { renderMain } from '../render';
import React from 'react';
const { describe, it, before, after, document } = global;
import { expect } from 'chai';
import { spy, stub } from 'sinon';

import StoryStore from '../story_store';

describe('render', () => {
  describe('renderMain', () => {
    before(() => {
      stub(document, 'getElementById').returns(document.createElement('div'));
    });

    after(() => {
      document.getElementById.restore();
    });

    it('should provide render function to story', () => {
      let i = 0;
      const story = ({ render }) => { // eslint-disable-line
        if (i === 0) {
          i++;
          render();
        }

        return <p>Test</p>;
      };
      const storySpy = spy(story);
      const selectedKind = '';
      const selectedStory = '';
      const storyStore = new StoryStore();
      storyStore.addStory(selectedKind, selectedStory, storySpy);

      renderMain({ selectedKind, selectedStory }, storyStore);

      expect(storySpy.calledTwice).to.equal(true);
    });
  });
});

/* eslint-disable */
() => <div onClick={() => render()}>Test</div>;

import reducer from '../preview';
import { expect } from 'chai';
import { types } from '../../../actions';
const { describe, it } = global;

describe('manager.preview.config.reducers.preview', () => {
  describe('SELECT_STORY', () => {
    it('should set kind and story', () => {
      const stories = [
        {
          kind: 'kk',
          stories: ['ss'],
        },
      ];
      const action = {
        type: types.SELECT_STORY,
        kind: 'kk',
        story: 'ss',
      };

      const newState = reducer({ stories }, action);
      expect(newState.selectedKind).to.be.equal(action.kind);
      expect(newState.selectedStory).to.be.equal(action.story);
    });

    it('should set the first kind, if the kind is non-exisitance', () => {
      const stories = [
        {
          kind: 'bb',
          stories: ['ss'],
        },
      ];
      const action = {
        type: types.SELECT_STORY,
        kind: 'kk',
        story: 'ss',
      };

      const newState = reducer({ stories }, action);
      expect(newState.selectedKind).to.be.equal(stories[0].kind);
      expect(newState.selectedStory).to.be.equal(action.story);
    });

    it('should set the first story, if the story is non-exisitance', () => {
      const stories = [
        {
          kind: 'kk',
          stories: ['ss', 'll'],
        },
      ];
      const action = {
        type: types.SELECT_STORY,
        kind: 'kk',
        story: 'dd',
      };

      const newState = reducer({ stories }, action);
      expect(newState.selectedKind).to.be.equal(action.kind);
      expect(newState.selectedStory).to.be.equal('ss');
    });
  });

  describe('CLEAR_ACTIONS', () => {
    it('should clear actions', () => {
      const actions = [10, 20];
      const action = {
        type: types.CLEAR_ACTIONS,
      };

      const newState = reducer({ actions }, action);
      expect(newState.actions).to.deep.equal([]);
    });
  });

  describe('SET_STORIES', () => {
    it('should replace stories', () => {
      const stories = { aa: 10 };
      const selectedKind = 'kk';
      const selectedStory = 'ss';
      const newStories = [
        {
          kind: 'kk',
          stories: ['ss'],
        },
      ];

      const action = {
        type: types.SET_STORIES,
        stories: newStories,
      };

      const newState = reducer({ stories, selectedKind, selectedStory }, action);
      expect(newState.stories).to.deep.equal(newStories);
      expect(newState.selectedKind).to.be.equal(selectedKind);
      expect(newState.selectedStory).to.be.equal(selectedStory);
    });

    it('should set selectedKind again if not exists', () => {
      const stories = { aa: 10 };
      const selectedKind = 'kk';
      const selectedStory = 'ss';
      const newStories = [
        {
          kind: 'dd',
          stories: ['ss'],
        },
      ];

      const action = {
        type: types.SET_STORIES,
        stories: newStories,
      };

      const newState = reducer({ stories, selectedKind, selectedStory }, action);
      expect(newState.stories).to.deep.equal(newStories);
      expect(newState.selectedKind).to.be.equal('dd');
      expect(newState.selectedStory).to.be.equal(selectedStory);
    });

    it('should set selectedStory again if not exists', () => {
      const stories = { aa: 10 };
      const selectedKind = 'kk';
      const selectedStory = 'ss';
      const newStories = [
        {
          kind: 'kk',
          stories: ['pk'],
        },
      ];

      const action = {
        type: types.SET_STORIES,
        stories: newStories,
      };

      const newState = reducer({ stories, selectedKind, selectedStory }, action);
      expect(newState.stories).to.deep.equal(newStories);
      expect(newState.selectedKind).to.be.equal(selectedKind);
      expect(newState.selectedStory).to.be.equal('pk');
    });

    it('should set default selectedKind and selectedStory', () => {
      const stories = { aa: 10 };
      const newStories = [
        {
          kind: 'kk',
          stories: ['pk'],
        },
      ];

      const action = {
        type: types.SET_STORIES,
        stories: newStories,
      };

      const newState = reducer({ stories }, action);
      expect(newState.stories).to.deep.equal(newStories);
      expect(newState.selectedKind).to.be.equal('kk');
      expect(newState.selectedStory).to.be.equal('pk');
    });
  });

  describe('ADD_ACTION', () => {
    it('should add an action to the beginning', () => {
      const actions = [10, 20];
      const action = {
        type: types.ADD_ACTION,
        action: 90,
      };

      const newState = reducer({ actions }, action);
      expect(newState.actions).to.deep.equal([90, ...actions]);
    });

    it('should create actions array for the first time', () => {
      const action = {
        type: types.ADD_ACTION,
        action: 90,
      };
      const newState = reducer({}, action);
      expect(newState.actions).to.deep.equal([90]);
    });

    it('should not have no more than 10 actions', () => {
      const actions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
      const action = {
        type: types.ADD_ACTION,
        action: 90,
      };

      const newState = reducer({ actions }, action);
      expect(newState.actions).to.deep.equal([90, ...actions.slice(0, 9)]);
    });
  });
});

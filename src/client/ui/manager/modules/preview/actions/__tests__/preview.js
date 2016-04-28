import actions from '../preview';
import { expect } from 'chai';
import sinon from 'sinon';
import { types } from '../';
const { describe, it } = global;

describe('manager.preview.actions.preview', () => {
  describe('selectStory', () => {
    it('should dispatch related redux action', () => {
      const reduxStore = {
        dispatch: sinon.stub(),
      };
      const kind = 'kkkind';
      const story = 'ssstory';

      actions.selectStory({ reduxStore }, kind, story);
      const action = reduxStore.dispatch.args[0][0];
      expect(action).to.deep.equal({
        type: types.SELECT_STORY,
        kind,
        story,
      });
    });
  });

  describe('clearActions', () => {
    it('should dispatch related redux action', () => {
      const reduxStore = {
        dispatch: sinon.stub(),
      };

      actions.clearActions({ reduxStore });
      const action = reduxStore.dispatch.args[0][0];
      expect(action).to.deep.equal({
        type: types.CLEAR_ACTIONS,
      });
    });
  });
});

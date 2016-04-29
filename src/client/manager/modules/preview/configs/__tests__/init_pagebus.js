import initPageBus from '../init_pagebus';
import { expect } from 'chai';
const { describe, it } = global;
import { types } from '../../actions';
import sinon from 'sinon';
import { EventEmitter } from 'events';

describe('manager.preview.config.initPageBus', () => {
  it('should send currentStory to the iframe', (done) => {
    const dataId = 'dasds';
    const kind = 'fdfd';
    const story = 'dfdfdf';

    const bus = {
      on() {},
      emit: sinon.stub(),
    };

    const reduxStore = {
      subscribe: (cb) => {
        setTimeout(cb, 10);
      },
      getState: () => ({
        preview: {
          selectedKind: kind,
          selectedStory: story,
        },
        core: {
          dataId,
        },
      }),
    };

    initPageBus(bus, reduxStore);

    setTimeout(() => {
      const event = bus.emit.args[0][0];
      const payload = JSON.parse(bus.emit.args[0][1]);

      expect(event).to.be.equal(`${dataId}.setCurrentStory`);
      expect(payload).to.deep.equal({ kind, story });
      done();
    }, 20);
  });

  it('should send nothing to iframe if no preview data', (done) => {
    const dataId = 'dasds';

    const bus = {
      on() {},
      emit: sinon.stub(),
    };

    const reduxStore = {
      subscribe: (cb) => {
        setTimeout(cb, 10);
      },
      getState: () => ({
        core: {
          dataId,
        },
      }),
    };

    initPageBus(bus, reduxStore);

    setTimeout(() => {
      expect(bus.emit.callCount).to.be.equal(0);
      done();
    }, 20);
  });

  it('should dispatch ADD_ACTION', () => {
    const dataId = 'dasds';
    const bus = new EventEmitter();
    const reduxStore = {
      subscribe() {},
      getState: () => ({
        core: {
          dataId,
        },
      }),
      dispatch: sinon.stub(),
    };

    initPageBus(bus, reduxStore);
    const action = { aa: 10 };
    bus.emit(`${dataId}.addAction`, JSON.stringify(action));

    expect(reduxStore.dispatch.args[0][0]).to.deep.equal({
      type: types.ADD_ACTION,
      action,
    });
  });

  it('should dispatch SET_STORIES', () => {
    const dataId = 'dasds';
    const bus = new EventEmitter();
    const reduxStore = {
      subscribe() {},
      getState: () => ({
        core: {
          dataId,
        },
      }),
      dispatch: sinon.stub(),
    };

    initPageBus(bus, reduxStore);
    const stories = [{ kind: 'aa' }];
    bus.emit(`${dataId}.setStories`, JSON.stringify(stories));

    expect(reduxStore.dispatch.args[0][0]).to.deep.equal({
      type: types.SET_STORIES,
      stories,
    });
  });

  it('should dispatch SELECT_STORY', () => {
    const dataId = 'dasds';
    const bus = new EventEmitter();
    const reduxStore = {
      subscribe() {},
      getState: () => ({
        core: {
          dataId,
        },
      }),
      dispatch: sinon.stub(),
    };

    initPageBus(bus, reduxStore);
    const kind = 'kk';
    const story = 'ss';
    bus.emit(`${dataId}.selectStory`, JSON.stringify({ kind, story }));

    expect(reduxStore.dispatch.args[0][0]).to.deep.equal({
      type: types.SELECT_STORY,
      kind,
      story,
    });
  });
});

import React, { useEffect } from 'react';
import { jest, describe, it, expect } from '@jest/globals';
import global from 'global';

import { renderToDOM } from './render';

jest.setTimeout(1000);
// let mockGlobal = {};
// jest.mock('global', () => () => mockGlobal);

describe('react renderer', () => {
  [true, false].forEach((legacyRootApi) => {
    beforeEach(() => {
      global.FRAMEWORK_OPTIONS = { legacyRootApi };
      // console.log(global.FRAMEWORK_OPTIONS);
    });

    describe(`legacyRootApi = ${legacyRootApi}`, () => {
      it('waits until the component has rendered', async () => {
        const domElement = document.createElement('div');
        const unboundStoryFn = jest.fn(() => 'Story');
        const showMain = jest.fn();

        await renderToDOM({ unboundStoryFn, showMain } as any, domElement);
        expect(unboundStoryFn).toHaveBeenCalledTimes(1);
        expect(domElement.innerHTML).toBe('Story');
      });

      it('re-renders the story when called again', async () => {
        const domElement = document.createElement('div');
        const unboundStoryFn = jest.fn(() => 'Story');
        const showMain = jest.fn();

        await renderToDOM({ unboundStoryFn, showMain } as any, domElement);
        await renderToDOM({ unboundStoryFn, showMain } as any, domElement);
        expect(unboundStoryFn).toHaveBeenCalledTimes(2);
      });

      it('does not remount the component when called a second time', async () => {
        const domElement = document.createElement('div');
        const effect = jest.fn();
        const Component = () => {
          useEffect(effect as any, []);
          return <div>Component</div>;
        };
        const unboundStoryFn = jest.fn(() => <Component />);
        const showMain = jest.fn();

        await renderToDOM({ unboundStoryFn, showMain } as any, domElement);
        await renderToDOM({ unboundStoryFn, showMain } as any, domElement);
        expect(effect).toHaveBeenCalledTimes(1);
      });

      it('does remount the component when called with forceRemount', async () => {
        const domElement = document.createElement('div');
        const effect = jest.fn();
        const Component = () => {
          useEffect(effect as any, []);
          return <div>Component</div>;
        };
        const unboundStoryFn = jest.fn(() => <Component />);
        const showMain = jest.fn();

        await renderToDOM({ unboundStoryFn, showMain } as any, domElement);
        await renderToDOM({ unboundStoryFn, showMain, forceRemount: true } as any, domElement);
        expect(effect).toHaveBeenCalledTimes(2);
      });
    });
  });
});

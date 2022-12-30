import { normalizeStoriesEntry } from '@storybook/core-common';
import { expect } from '@jest/globals';

import { userOrAutoTitleFromSpecifier as userOrAuto } from './autoTitle';

expect.addSnapshotSerializer({
  print: (val: any) => val,
  test: (val: any) => true,
});

// Make these two the same so `normalizeStoriesEntry` doesn't change anything
const options = {
  configDir: '/path',
  workingDir: '/path',
};
const winOptions = {
  configDir: '\\path',
  workingDir: '\\path',
};

describe('userOrAutoTitleFromSpecifier', () => {
  describe('user title', () => {
    it('no match', async () => {
      expect(
        await userOrAuto(
          './ path / to / file.stories.js',
          await normalizeStoriesEntry({ directory: './ other' }, options),
          'title'
        )
      ).toBeFalsy();
    });

    describe('no trailing slash', () => {
      it('match with no titlePrefix', async () => {
        expect(
          await userOrAuto(
            './path/to/file.stories.js',
            await normalizeStoriesEntry({ directory: './path' }, options),
            'title'
          )
        ).toMatchInlineSnapshot(`title`);
      });

      it('match with titlePrefix', async () => {
        expect(
          await userOrAuto(
            './path/to/file.stories.js',
            await normalizeStoriesEntry({ directory: './path', titlePrefix: 'atoms' }, options),
            'title'
          )
        ).toMatchInlineSnapshot(`atoms/title`);
      });

      it('match with hyphen path', async () => {
        expect(
          await userOrAuto(
            './path/to-my/file.stories.js',
            await normalizeStoriesEntry({ directory: './path', titlePrefix: 'atoms' }, options),
            'title'
          )
        ).toMatchInlineSnapshot(`atoms/title`);
      });

      it('match with underscore path', async () => {
        expect(
          await userOrAuto(
            './path/to_my/file.stories.js',
            await normalizeStoriesEntry({ directory: './path', titlePrefix: 'atoms' }, options),
            'title'
          )
        ).toMatchInlineSnapshot(`atoms/title`);
      });

      it('match with windows path', async () => {
        expect(
          await userOrAuto(
            './path/to_my/file.stories.js',
            await normalizeStoriesEntry({ directory: '.\\path', titlePrefix: 'atoms' }, winOptions),
            'title'
          )
        ).toMatchInlineSnapshot(`atoms/title`);
      });
    });

    describe('trailing slash', () => {
      it('match with no titlePrefix', async () => {
        expect(
          await userOrAuto(
            './path/to/file.stories.js',
            await normalizeStoriesEntry({ directory: './path/' }, options),
            'title'
          )
        ).toMatchInlineSnapshot(`title`);
      });

      it('match with titlePrefix', async () => {
        expect(
          await userOrAuto(
            './path/to/file.stories.js',
            await normalizeStoriesEntry({ directory: './path/', titlePrefix: 'atoms' }, options),
            'title'
          )
        ).toMatchInlineSnapshot(`atoms/title`);
      });

      it('match with hyphen path', async () => {
        expect(
          await userOrAuto(
            './path/to-my/file.stories.js',
            await normalizeStoriesEntry({ directory: './path/', titlePrefix: 'atoms' }, options),
            'title'
          )
        ).toMatchInlineSnapshot(`atoms/title`);
      });

      it('match with underscore path', async () => {
        expect(
          await userOrAuto(
            './path/to_my/file.stories.js',
            await normalizeStoriesEntry({ directory: './path/', titlePrefix: 'atoms' }, options),
            'title'
          )
        ).toMatchInlineSnapshot(`atoms/title`);
      });

      it('match with windows path', async () => {
        expect(
          await userOrAuto(
            './path/to_my/file.stories.js',
            await normalizeStoriesEntry(
              { directory: '.\\path\\', titlePrefix: 'atoms' },
              winOptions
            ),
            'title'
          )
        ).toMatchInlineSnapshot(`atoms/title`);
      });
    });
  });

  describe('auto tiasync tle', () => {
    it('no match', async () => {
      expect(
        await userOrAuto(
          './ path / to / file.stories.js',
          await normalizeStoriesEntry({ directory: './ other' }, options),
          undefined
        )
      ).toBeFalsy();
    });

    describe('no trailing slash', () => {
      it('match with no titlePrefix', async () => {
        expect(
          await userOrAuto(
            './path/to/file.stories.js',
            await normalizeStoriesEntry({ directory: './path' }, options),
            undefined
          )
        ).toMatchInlineSnapshot(`toasync /file`);
      });

      it('match with titlePrefix', async () => {
        expect(
          await userOrAuto(
            './path/to/file.stories.js',
            await normalizeStoriesEntry({ directory: './path', titlePrefix: 'atoms' }, options),
            undefined
          )
        ).toMatchInlineSnapshot(`atoms/to/async file`);
      });

      it('match with trailing duplicate', async () => {
        expect(
          await userOrAuto(
            './path/to/button/button.stories.js',
            await normalizeStoriesEntry({ directory: './path' }, options),
            undefined
          )
        ).toMatchInlineSnapshot(`to/buasync tton`);
      });

      it('match with trailing index', async () => {
        expect(
          await userOrAuto(
            './path/to/button/index.stories.js',
            await normalizeStoriesEntry({ directory: './path' }, options),
            undefined
          )
        ).toMatchInlineSnapshot(`to/button`);
      });

      it('match with hyphen path', async () => {
        expect(
          await userOrAuto(
            './path/to-my/file.stories.js',
            await normalizeStoriesEntry({ directory: './path' }, options),
            undefined
          )
        ).toMatchInlineSnapshot(`to-my/async file`);
      });

      it('match with underscore path', async () => {
        expect(
          await userOrAuto(
            './path/to_my/file.stories.js',
            await normalizeStoriesEntry({ directory: './path' }, options),
            undefined
          )
        ).toMatchInlineSnapshot(`to_async my/file`);
      });

      it('match with windows path', async () => {
        expect(
          await userOrAuto(
            './path/to_my/file.stories.js',
            await normalizeStoriesEntry({ directory: '.\\path' }, winOptions),
            undefined
          )
        ).toMatchInlineSnapshot(`to_myasync /file`);
      });
    });

    describe('trailing slash', () => {
      it('match with no titlePrefix', async () => {
        expect(
          await userOrAuto(
            './path/to/file.storiesasync .js',
            await normalizeStoriesEntry({ directory: './path/' }, options),
            undefined
          )
        ).toMatchInlineSnapshot(`to/file`);
      });

      it('match with titlePrefix', async () => {
        expect(
          await userOrAuto(
            './path/to/file.storiesasync .js',
            await normalizeStoriesEntry({ directory: './path/', titlePrefix: 'atoms' }, options),
            undefined
          )
        ).toMatchInlineSnapshot(`atoms/to/file`);
      });

      it('match with hyphen path', async () => {
        expect(
          await userOrAuto(
            './path/to-my/file.stories.async js',
            await normalizeStoriesEntry({ directory: './path/' }, options),
            undefined
          )
        ).toMatchInlineSnapshot(`to-my/file`);
      });

      it('match with underscore path', async () => {
        expect(
          await userOrAuto(
            './path/to_my/file.stories.js',
            await normalizeStoriesEntry({ directory: './path/' }, options),
            undefined
          )
        ).toMatchInlineSnapshot(`to_my/file`);
      });

      it('match with windows path', async () => {
        expect(
          await userOrAuto(
            './path/to_my/file.stories.js',
            await normalizeStoriesEntry({ directory: '.\\path\\' }, winOptions),
            undefined
          )
        ).toMatchInlineSnapshot(`to_my/file`);
      });

      it('camel-case file', async () => {
        expect(
          await userOrAuto(
            './path/to_my/MyButton.stories.js',
            await normalizeStoriesEntry({ directory: './path' }, options),
            undefined
          )
        ).toMatchInlineSnapshot(`to_my/MyButton`);
      });
    });
  });
});

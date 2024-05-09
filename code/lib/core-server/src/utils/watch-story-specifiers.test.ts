import type { Mocked } from 'vitest';
import { describe, afterEach, it, expect, vi, Mock } from 'vitest';
import { normalizeStoriesEntry } from '@storybook/core-common';
import path from 'path';
import type { SubscribeCallback } from '@parcel/watcher';
import watchImport from '@parcel/watcher';

import { watchStorySpecifiers, condenseDirectoryList } from './watch-story-specifiers';

vi.mock('@parcel/watcher', () => {
  return {
    default: {
      subscribe: vi.fn(() => Promise.resolve({ unsubscribe: () => Promise.resolve() })),
    },
  };
});

const watch = watchImport as Mocked<typeof watchImport>;

describe('watchStorySpecifiers', () => {
  const workingDir = path.join(__dirname, '__mockdata__');
  const options = {
    configDir: path.join(workingDir, '.storybook'),
    workingDir,
  };

  let close: () => Promise<void>;
  afterEach(() => close?.());

  const abspath = (filename: string) => path.join(workingDir, filename);

  const createEventHelpers = (subscribeCallback: SubscribeCallback = () => {}) => {
    const onChange = (filename: string) => {
      subscribeCallback(null, [{ type: 'update', path: abspath(filename) }]);
    };
    const onRemove = (filename: string) => {
      subscribeCallback(null, [{ type: 'delete', path: abspath(filename) }]);
    };
    return { onChange, onRemove };
  };

  it('watches basic globs', async () => {
    const specifier = normalizeStoriesEntry('../src/**/*.stories.@(ts|js)', options);

    const onInvalidate = vi.fn();
    close = await watchStorySpecifiers([specifier], { workingDir }, onInvalidate);

    expect(watch.subscribe).toHaveBeenCalledTimes(1);
    const { onChange, onRemove } = createEventHelpers(watch.subscribe.mock.lastCall?.[1]);

    // File changed, matching
    onInvalidate.mockClear();
    onChange('src/nested/Button.stories.ts');
    expect(onInvalidate).toHaveBeenCalledWith(specifier, `./src/nested/Button.stories.ts`, false);

    // File changed, NOT matching
    onInvalidate.mockClear();
    onChange('src/nested/Button.ts');
    expect(onInvalidate).not.toHaveBeenCalled();

    // File removed, matching
    onInvalidate.mockClear();
    onRemove('src/nested/Button.stories.ts');
    expect(onInvalidate).toHaveBeenCalledWith(specifier, `./src/nested/Button.stories.ts`, true);

    // File removed, NOT matching
    onInvalidate.mockClear();
    onRemove('src/nested/Button.ts');
    expect(onInvalidate).not.toHaveBeenCalled();
  });

  it('condenses multiple directories into a single watcher', async () => {
    const specifiers = [
      normalizeStoriesEntry('../src/**/*.stories.@(ts|js)', options),
      normalizeStoriesEntry('../src/nested/**/*.stories.@(ts|js)', options),
      normalizeStoriesEntry('../src/nested/deeply/**/*.stories.@(ts|js)', options),
    ];
    const onInvalidate = vi.fn();
    close = await watchStorySpecifiers(specifiers, { workingDir }, onInvalidate);

    expect(watch.subscribe).toHaveBeenCalledTimes(1);
    expect(watch.subscribe.mock.lastCall?.[0]).toEqual(`${workingDir}/src`);
  });

  it('is able to watch multiple directories', async () => {
    const aSpecifier = normalizeStoriesEntry('../src/**/*.stories.@(ts|js)', options);
    const bSpecifier = normalizeStoriesEntry('../complex/**/*.stories.@(ts|js)', options);

    const onInvalidate = vi.fn();
    close = await watchStorySpecifiers([aSpecifier, bSpecifier], { workingDir }, onInvalidate);

    expect(watch.subscribe).toHaveBeenCalledTimes(2);

    const aSubscribeCallback = watch.subscribe.mock.calls.find((c) => c[0].endsWith('/src'))?.[1];
    const bSubscribeCallback = watch.subscribe.mock.calls.find((c) =>
      c[0].endsWith('/complex')
    )?.[1];
    expect(aSubscribeCallback).not.toBe(undefined);
    const aHelpers = createEventHelpers(aSubscribeCallback);
    const bHelpers = createEventHelpers(bSubscribeCallback);

    // File changed under a, matching
    onInvalidate.mockClear();
    aHelpers.onChange('src/nested/Button.stories.ts');
    expect(onInvalidate).toHaveBeenCalledWith(aSpecifier, `./src/nested/Button.stories.ts`, false);

    // File changed under a, NOT matching
    onInvalidate.mockClear();
    aHelpers.onChange('src/nested/Button.stories.mdx');
    expect(onInvalidate).not.toHaveBeenCalled();

    // File changed under b, matching
    onInvalidate.mockClear();
    bHelpers.onChange('complex/nested/Button.stories.ts');
    expect(onInvalidate).toHaveBeenCalledWith(
      bSpecifier,
      `./complex/nested/Button.stories.ts`,
      false
    );

    // File changed under b, NOT matching
    onInvalidate.mockClear();
    bHelpers.onChange('complex/nested/Button.stories.mdx');
    expect(onInvalidate).not.toHaveBeenCalled();
  });

  it('multiplexes between two specifiers on the same directory', async () => {
    const globSpecifier = normalizeStoriesEntry('../src/**/*.stories.@(ts|js)', options);
    const fileSpecifier = normalizeStoriesEntry('../src/nested/Button.stories.mdx', options);

    const onInvalidate = vi.fn();
    close = await watchStorySpecifiers(
      [globSpecifier, fileSpecifier],
      { workingDir },
      onInvalidate
    );

    expect(watch.subscribe).toHaveBeenCalledTimes(1);
    const { onChange, onRemove } = createEventHelpers(watch.subscribe.mock.lastCall?.[1]);

    // File changed matching glob specifier
    onInvalidate.mockClear();
    onChange('src/nested/Button.stories.ts');
    expect(onInvalidate).toHaveBeenCalledWith(
      globSpecifier,
      `./src/nested/Button.stories.ts`,
      false
    );

    // File removed matching glob specifier
    onInvalidate.mockClear();
    onRemove('src/nested/Button.stories.ts');
    expect(onInvalidate).toHaveBeenCalledWith(
      globSpecifier,
      `./src/nested/Button.stories.ts`,
      true
    );

    // File changed matching file specifier
    onInvalidate.mockClear();
    onChange('src/nested/Button.stories.mdx');
    expect(onInvalidate).toHaveBeenCalledWith(
      fileSpecifier,
      `./src/nested/Button.stories.mdx`,
      false
    );

    // File removed matching file specifier
    onInvalidate.mockClear();
    onRemove('src/nested/Button.stories.mdx');
    expect(onInvalidate).toHaveBeenCalledWith(
      fileSpecifier,
      `./src/nested/Button.stories.mdx`,
      true
    );

    // File changed matching nothing
    onInvalidate.mockClear();
    onChange('src/nested/Button.stories.tsx');
    expect(onInvalidate).not.toHaveBeenCalled();
  });

  it('can handle multiple events in the same watch call', async () => {
    const specifier = normalizeStoriesEntry('../src/**/*.stories.@(ts|js)', options);

    const onInvalidate = vi.fn();
    close = await watchStorySpecifiers([specifier], { workingDir }, onInvalidate);

    expect(watch.subscribe).toHaveBeenCalledTimes(1);
    const subscribeCallback = watch.subscribe.mock.lastCall?.[1] || (() => {});

    subscribeCallback(null, [
      { type: 'create', path: abspath('src/nested/Foo.stories.ts') },
      { type: 'update', path: abspath('src/nested/Bar.stories.ts') },
      { type: 'delete', path: abspath('src/nested/Baz.stories.ts') },
      { type: 'delete', path: abspath('src/nested/NotMatching.ts') },
    ]);
    expect(onInvalidate).toHaveBeenCalledTimes(3);
    expect(onInvalidate.mock.calls).toEqual([
      [specifier, './src/nested/Foo.stories.ts', false],
      [specifier, './src/nested/Bar.stories.ts', false],
      [specifier, './src/nested/Baz.stories.ts', true],
    ]);
  });
});

describe('condenseDirectoryList', () => {
  it('removes duplicates', () => {
    expect(
      condenseDirectoryList([
        '/path/to/dir/a',
        '/path/to/dir/a',
        '/path/to/dir/a',
        '/path/to/dir/b',
        '/path/to/dir/c',
      ]).sort()
    ).toEqual(['/path/to/dir/a', '/path/to/dir/b', '/path/to/dir/c'].sort());
  });
  it('removes children', () => {
    expect(
      condenseDirectoryList([
        '/path/to/dir/a/b/c',
        '/path/to/dir/a/b',
        '/path/to/dir/a',
        // Make sure it doesn't check prefix only
        '/path/to/dir/another',
      ]).sort()
    ).toEqual(['/path/to/dir/a', '/path/to/dir/another'].sort());
  });
});

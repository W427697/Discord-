/* eslint-disable no-underscore-dangle */

'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { View } from '@storybook/nextjs-server/preview-api';
import { PreviewWithSelection, addons, UrlStore } from '@storybook/nextjs-server/preview-api';
import { createBrowserChannel } from '@storybook/nextjs-server/channels';
import type { StoryIndex } from '@storybook/nextjs-server/types';
import { setArgs } from './args';

global.FEATURES = { storyStoreV7: true };

// A version of the URL store that doesn't change route when the selection changes
// (as we change the URL as part of rendering the story)
class StaticUrlStore extends UrlStore {
  setSelection(selection: Parameters<typeof UrlStore.prototype.setSelection>[0]) {
    this.selection = selection;
  }
}

// A view that doesn't do anything when called, as we don't need to display errors etc.
class NoopView implements View<Record<string, never>> {
  prepareForStory() {
    return {}; // canvasElement
  }

  prepareForDocs() {
    return {}; // canvasElement
  }

  showErrorDisplay() {}

  showNoPreview() {}

  showPreparingStory() {}

  showPreparingDocs() {}

  showMain() {}

  showDocs() {}

  showStory() {}

  showStoryDuringRender() {}
}

// Construct a CSF file from all the index entries on a path
function pathToCSFile(allEntries: StoryIndex['entries'], path: string) {
  const entries = Object.values(allEntries || []).filter(
    ({ importPath }: any) => importPath === path
  ) as { id: string; name: string; title: string }[];

  if (entries.length === 0) throw new Error(`Couldn't find import path ${path}, this is odd`);

  const mappedEntries: [string, { name: string }][] = entries.map(({ id, name }) => [
    id.split('--')[1],
    { name },
  ]);

  return Object.fromEntries([['default', { title: entries[0].title }] as const, ...mappedEntries]);
}

export const Preview = () => {
  const router = useRouter();
  useEffect(() => {
    const channel = createBrowserChannel({ page: 'preview' });
    addons.setChannel(channel);

    const preview = new PreviewWithSelection(new StaticUrlStore(), new NoopView());
    preview.initialize({
      importFn: async (path) => pathToCSFile(preview.storyStore.storyIndex!.entries, path),
      getProjectAnnotations: () => ({
        render: () => {},
        renderToCanvas: ({ id, storyContext: { args } }) => {
          setArgs(id, args);
          router.push(`/storybookPreview/${id}`);
        },
      }),
    });

    window.__STORYBOOK_PREVIEW__ = preview;
    window.__STORYBOOK_ADDONS_CHANNEL__ = channel;

    return () => {};
  }, []);
  return <></>;
};

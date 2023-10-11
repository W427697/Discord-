'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PreviewWithSelection, addons } from '@storybook/preview-api';
import { createBrowserChannel } from '@storybook/channels';
// import { setArgs } from '../args';

// @ts-ignore
global.FEATURES = { storyStoreV7: true };

export const Preview = () => {
  const router = useRouter();
  useEffect(() => {
    console.log('Storybook');

    const selectionStore = {
      selectionSpecifier: {
        storySpecifier: '*',
        viewMode: 'story',
      },

      selection: undefined,

      setSelection(selection: any) {
        this.selection = selection;
      },

      setQueryParams: (...args: any[]) => console.log('setQueryParams', ...args),
    };
    const view = {
      prepareForStory: (...args: any[]) => {
        console.log('prepareForStory', ...args);
        return {}; // canvasElement
      },

      prepareForDocs: (...args: any[]) => console.log('prepareForDocs', ...args),

      showErrorDisplay: (...args: any[]) => console.log('showErrorDisplay', ...args),

      showNoPreview: (...args: any[]) => console.log('showNoPreview', ...args),

      showPreparingStory: (...args: any[]) => console.log('showPreparingStory', ...args),

      showPreparingDocs: (...args: any[]) => console.log('showPreparingDocs', ...args),

      showMain: (...args: any[]) => console.log('showMain', ...args),

      showDocs: (...args: any[]) => console.log('showDocs', ...args),

      showStory: (...args: any[]) => console.log('showStory', ...args),

      showStoryDuringRender: (...args: any[]) => console.log('showStoryDuringRender', ...args),
    };

    const channel = createBrowserChannel({ page: 'preview' });
    addons.setChannel(channel);

    const importFn = async (path: string) => {
      console.log(`import ${path}`);

      const entries = Object.values(preview.storyStore.storyIndex?.entries || []).filter(
        ({ importPath }: any) => importPath === path
      ) as { id: string; name: string; title: string }[];

      if (entries.length === 0) throw new Error(`Couldn't find import path ${path}, this is odd`);

      const mappedEntries: [string, { name: string }][] = entries.map(({ id, name }) => [
        id.split('--')[1],
        { name },
      ]);

      return Object.fromEntries([
        ['default', { title: entries[0].title }] as const,
        ...mappedEntries,
      ]);
    };
    const getProjectAnnotations = () => {
      console.log('getProjectAnnotations');
      return {
        render(x: any) {
          console.log('render', x);
          return x;
        },
        renderToCanvas({ id, storyFn, storyContext: { args } }: any) {
          // storyFn() // calls render with the export

          // setArgs(id, args);
          console.log('renderToCanvas', id, args);
          // FIXME hardcoded path
          router.push(`/storybook/${id}`);

          // wait for the the route to change
          // find the canvas element
          // run the play function
        },
      };
    };

    // xx@ts-expect-error temp
    const preview = new PreviewWithSelection(selectionStore, view);
    // xx@ts-expect-error temp
    preview.initialize({ importFn, getProjectAnnotations });

    // @ts-ignore
    window.__STORYBOOK_PREVIEW__ = preview;
    // @ts-ignore
    window.__STORYBOOK_ADDONS_CHANNEL__ = channel;

    return () => {};
  }, []);
  return <></>;
};

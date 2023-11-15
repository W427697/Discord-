/* eslint-disable no-underscore-dangle */
import React from 'react';
import { useRouter } from 'next/navigation';
import type { Renderer } from '@storybook/csf';
import { createBrowserChannel } from '@storybook/channels';
import { PreviewWithSelection, addons, UrlStore, WebView } from '@storybook/preview-api';
import type { ModuleExports, StoryIndex } from '@storybook/types';

import { previewHtml } from './previewHtml';

type Path = string;

const csfFiles: Record<Path, ModuleExports> = {};
const csfResolvers: Record<Path, (moduleExports: ModuleExports) => void> = {};
const csfPromises: Record<Path, Promise<ModuleExports>> = {};
if (typeof window !== 'undefined') {
  window.FEATURES = { storyStoreV7: true };

  window._storybook_onImport = (path: Path, moduleExports: ModuleExports) => {
    console.log('_storybook_onImport', path, Object.keys(csfFiles), Object.keys(csfResolvers));
    csfFiles[path] = moduleExports;
    csfResolvers[path]?.(moduleExports);
  };
}

export const importFn = async (
  allEntries: StoryIndex['entries'],
  router: ReturnType<typeof useRouter>,
  path: Path
) => {
  console.log('importing', path);

  if (csfFiles[path]) {
    console.log('got it already, short circuiting');
    return csfFiles[path];
  }

  // @ts-expect-error TS is confused, this is not a bug
  if (csfPromises[path]) {
    console.log('got promise, short circuiting');
    return csfPromises[path];
  }

  // Find all index entries for this import path, to find a story id
  const entries = Object.values(allEntries || []).filter(
    ({ importPath }: any) => importPath === path
  ) as { id: string; name: string; title: string }[];

  if (entries.length === 0) throw new Error(`Couldn't find import path ${path}, this is odd`);

  const firstStoryId = entries[0].id;
  const componentId = firstStoryId.split('--')[0];

  csfPromises[path] = new Promise((resolve) => {
    csfResolvers[path] = resolve;
  });

  router.push(`/storybookPreview/${componentId}`);

  return csfPromises[path];
};

// A version of the URL store that doesn't change route when the selection changes
// (as we change the URL as part of rendering the story)
class StaticUrlStore extends UrlStore {
  setSelection(selection: Parameters<typeof UrlStore.prototype.setSelection>[0]) {
    this.selection = selection;
  }
}

type GetProjectAnnotations = Parameters<
  PreviewWithSelection<Renderer>['initialize']
>[0]['getProjectAnnotations'];
export const Preview = ({
  getProjectAnnotations,
}: {
  getProjectAnnotations: GetProjectAnnotations;
}) => {
  const router = useRouter();

  // We can't use React's useEffect in the monorepo because of dependency issues,
  // but we only need to ensure code runs *once* on the client only, so let's just make
  // our own version of that
  if (typeof window !== 'undefined') {
    if (!window.__STORYBOOK_PREVIEW__) {
      console.log('creating preview');
      const channel = createBrowserChannel({ page: 'preview' });
      addons.setChannel(channel);
      window.__STORYBOOK_ADDONS_CHANNEL__ = channel;

      const preview = new PreviewWithSelection(new StaticUrlStore(), new WebView());

      preview.initialize({
        importFn: (path) => importFn(preview.storyStore.storyIndex!.entries, router, path),
        getProjectAnnotations,
      });
      window.__STORYBOOK_PREVIEW__ = preview;
    }

    // Render the the SB UI (ie iframe.html / preview.ejs) in a non-react way to ensure
    // it doesn't get ripped down when a new route renders
    if (!document.querySelector('#storybook-root')) {
      document.body.innerHTML += previewHtml;
    }
  }

  return <></>;
};

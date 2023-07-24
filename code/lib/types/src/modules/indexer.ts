import type { StoryId, ComponentTitle, StoryName, Parameters, Tag, Path } from './csf';

interface StoriesSpecifier {
  /**
   * When auto-titling, what to prefix all generated titles with (default: '')
   */
  titlePrefix?: string;
  /**
   * Where to start looking for story files
   */
  directory: string;
  /**
   * What does the filename of a story file look like?
   * (a glob, relative to directory, no leading `./`)
   * If unset, we use `** / *.@(mdx|stories.@(mdx|js|jsx|mjs|ts|tsx))` (no spaces)
   */
  files?: string;
}

export type StoriesEntry = string | StoriesSpecifier;

export type NormalizedStoriesSpecifier = Required<StoriesSpecifier> & {
  /*
   * Match the "importPath" of a file (e.g. `./src/button/Button.stories.js')
   * relative to the current working directory.
   */
  importPathMatcher: RegExp;
};

export interface IndexerOptions {
  makeTitle: (userTitle?: string) => string;
}

export interface IndexedStory {
  id: string;
  name: string;
  tags?: Tag[];
  parameters?: Parameters;
}
export interface IndexedCSFFile {
  meta: { title?: string; tags?: Tag[] };
  stories: IndexedStory[];
}

type BaseIndexer = {
  /**
   * A regular expression that should match all files to be handled by this indexer
   */
  test: RegExp;
};

/**
 * An indexer describes which filenames it handles, and how to index each individual file - turning it into an entry in the index.
 */
export type Indexer = BaseIndexer & {
  /**
   * Indexes a file containing stories or docs.
   * @param fileName The name of the file to index.
   * @param options Options for indexing the file.
   * @returns A promise that resolves to an object containing the indexed stories.
   */
  index: (fileName: string, options: IndexerOptions) => Promise<IndexedCSFFile>;
  /**
   * @deprecated Use {@link index} instead
   */
  indexer?: never;
};

type DeprecatedIndexer = BaseIndexer & {
  indexer: Indexer['index'];
  index?: never;
};

/**
 * @deprecated Use {@link Indexer} instead
 */
export type StoryIndexer = Indexer | DeprecatedIndexer;

export interface BaseIndexEntry {
  id: StoryId;
  name: StoryName;
  title: ComponentTitle;
  tags?: Tag[];
  importPath: Path;
}
export type StoryIndexEntry = BaseIndexEntry & {
  type: 'story';
};

export type DocsIndexEntry = BaseIndexEntry & {
  storiesImports: Path[];
  type: 'docs';
};

export type IndexEntry = StoryIndexEntry | DocsIndexEntry;

export interface V3CompatIndexEntry extends Omit<StoryIndexEntry, 'type' | 'tags'> {
  kind: ComponentTitle;
  story: StoryName;
  parameters: Parameters;
}

export interface StoryIndexV2 {
  v: number;
  stories: Record<
    StoryId,
    Omit<V3CompatIndexEntry, 'title' | 'name' | 'importPath'> & {
      name?: StoryName;
    }
  >;
}

export interface StoryIndexV3 {
  v: number;
  stories: Record<StoryId, V3CompatIndexEntry>;
}

export interface StoryIndex {
  v: number;
  entries: Record<StoryId, IndexEntry>;
}

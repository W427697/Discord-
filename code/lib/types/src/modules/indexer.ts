import type { StoryId, ComponentTitle, StoryName, Parameters, Tag, Path } from './csf';

type ExportKey = string;

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

/**
 * FIXME: This is a temporary type to allow us to deprecate the old indexer API.
 * We should remove this type and the deprecated indexer API in 8.0.
 */
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
   * @param options {@link IndexerOptions} for indexing the file.
   * @returns A promise that resolves to an array of {@link NewIndexEntry} objects.
   */
  index: (fileName: string, options: IndexerOptions) => Promise<NewIndexEntry[]>;
  /**
   * @deprecated Use {@link index} instead
   */
  indexer?: never;
};

type DeprecatedIndexer = BaseIndexer & {
  indexer: (fileName: string, options: IndexerOptions) => Promise<IndexedCSFFile>;
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

/**
 * @deprecated This type is deprecated and will be replaced with {@link NewIndexEntry} in 8.0.
 */
export type IndexEntry = StoryIndexEntry | DocsIndexEntry;
export interface NewBaseIndexEntry {
  /** the file to import from e.g. the story file */
  importPath: Path;
  /** the key to import from the file e.g. the story export for this entry */
  key: ExportKey;
  /** the location in the sidebar, auto-generated from {@link importPath} if unspecified */
  title?: ComponentTitle;
  /** the name of the story, auto-generated from {@link key} if unspecified */
  name?: StoryName;
  /** the unique story ID, auto-generated from {@link title} and {@link name} if unspecified */
  id?: StoryId;
  /** tags for filtering entries in Storybook and its tools */
  tags?: Tag[];
}
export type NewStoryIndexEntry = BaseIndexEntry & {
  type: 'story';
};

export type NewDocsIndexEntry = BaseIndexEntry & {
  type: 'docs';
  /** paths to story files that must be pre-loaded for this docs entry */
  storiesImports?: Path[];
};

export type NewIndexEntry = StoryIndexEntry | DocsIndexEntry;

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

import path from 'path';
import fs from 'fs-extra';
import glob from 'globby';
import slash from 'slash';

import type {
  Path,
  StoryIndex,
  V2CompatIndexEntry,
  StoryId,
  StoryIndexEntry,
} from '@storybook/store';
import { autoTitleFromSpecifier, sortStoriesV7 } from '@storybook/store';
import type { NormalizedStoriesSpecifier } from '@storybook/core-common';
import { normalizeStoryPath, scrubFileExtension } from '@storybook/core-common';
import { logger } from '@storybook/node-logger';
import { readCsfOrMdx, getStorySortParameter } from '@storybook/csf-tools';
import type { ComponentTitle } from '@storybook/csf';
import { toId } from '@storybook/csf';

type DocsCacheEntry = StoryIndexEntry & { type: 'docs' };
type StoriesCacheEntry = { entries: StoryIndexEntry[]; dependents: Path[]; type: 'stories' };
type CacheEntry = false | StoriesCacheEntry | DocsCacheEntry;
type SpecifierStoriesCache = Record<Path, CacheEntry>;

export class StoryIndexGenerator {
  // An internal cache mapping specifiers to a set of path=><set of stories>
  // Later, we'll combine each of these subsets together to form the full index
  private specifierToCache: Map<NormalizedStoriesSpecifier, SpecifierStoriesCache>;

  // Cache the last value of `getStoryIndex`. We invalidate (by unsetting) when:
  //  - any file changes, including deletions
  //  - the preview changes [not yet implemented]
  private lastIndex?: StoryIndex;

  constructor(
    public readonly specifiers: NormalizedStoriesSpecifier[],
    public readonly options: {
      workingDir: Path;
      configDir: Path;
      storiesV2Compatibility: boolean;
      storyStoreV7: boolean;
    }
  ) {
    this.specifierToCache = new Map();
  }

  async initialize() {
    // Find all matching paths for each specifier
    await Promise.all(
      this.specifiers.map(async (specifier) => {
        const pathToSubIndex = {} as SpecifierStoriesCache;

        const fullGlob = slash(
          path.join(this.options.workingDir, specifier.directory, specifier.files)
        );
        const files = await glob(fullGlob);
        files.sort().forEach((absolutePath: Path) => {
          const ext = path.extname(absolutePath);
          const relativePath = path.relative(this.options.workingDir, absolutePath);
          if (!['.js', '.jsx', '.ts', '.tsx', '.mdx'].includes(ext)) {
            logger.info(`Skipping ${ext} file ${relativePath}`);
            return;
          }

          pathToSubIndex[absolutePath] = false;
        });

        this.specifierToCache.set(specifier, pathToSubIndex);
      })
    );

    // Extract stories for each file
    await this.ensureExtracted();
  }

  async updateExtracted(
    updater: (specifier: NormalizedStoriesSpecifier, absolutePath: Path) => Promise<CacheEntry>
  ): Promise<void> {
    await Promise.all(
      this.specifiers.map(async (specifier) => {
        const entry = this.specifierToCache.get(specifier);
        return Promise.all(
          Object.keys(entry).map(async (absolutePath) => {
            entry[absolutePath] = entry[absolutePath] || (await updater(specifier, absolutePath));
          })
        );
      })
    );
  }

  isDocsMdx(absolutePath: Path) {
    return /\.docs\.mdx$/i.test(absolutePath);
  }

  async ensureExtracted(): Promise<StoryIndexEntry[]> {
    await this.updateExtracted(async (specifier, absolutePath) =>
      this.isDocsMdx(absolutePath) ? false : this.extractStories(specifier, absolutePath)
    );
    // process docs in a second pass
    await this.updateExtracted(async (specifier, absolutePath) =>
      this.extractDocs(specifier, absolutePath)
    );

    return this.specifiers.flatMap((specifier) => {
      const cache = this.specifierToCache.get(specifier);
      return Object.values(cache).flatMap((entry) => {
        if (!entry) return [];
        if (entry.type === 'docs') return [entry];
        return entry.entries;
      });
    });
  }

  async extractDocs(specifier: NormalizedStoriesSpecifier, absolutePath: Path) {
    const relativePath = path.relative(this.options.workingDir, absolutePath);
    try {
      const normalizedPath = normalizeStoryPath(relativePath);
      const importPath = slash(normalizedPath);
      const defaultTitle = autoTitleFromSpecifier(importPath, specifier);

      // eslint-disable-next-line global-require
      const { analyze } = await require('@storybook/docs-mdx');
      const content = await fs.readFile(absolutePath, 'utf8');
      // { title?, of?, imports? }
      const result = analyze(content);

      const makeAbsolute = (otherImport: Path) =>
        otherImport.startsWith('.')
          ? slash(
              path.join(
                this.options.workingDir,
                normalizeStoryPath(path.join(path.dirname(normalizedPath), otherImport))
              )
            )
          : otherImport;

      const absoluteImports = (result.imports as string[]).map(makeAbsolute);
      const absoluteOf = result.of && makeAbsolute(result.of);

      let ofTitle: string;
      const dependencies = [] as StoriesCacheEntry[];
      this.specifierToCache.forEach((cache) => {
        const fileNames = Object.keys(cache).filter((fileName) => {
          return absoluteImports.some((storyImport) => fileName.startsWith(storyImport));
        });
        fileNames.forEach((fileName) => {
          const cacheEntry = cache[fileName];
          if (cacheEntry && cacheEntry.type === 'stories') {
            if (fileName.startsWith(absoluteOf) && cacheEntry.entries.length > 0) {
              ofTitle = cacheEntry.entries[0].title;
            }
            dependencies.push(cacheEntry);
          } else {
            throw new Error(`Unexpected dependency: ${cacheEntry}`);
          }
        });
      });

      dependencies.forEach((dep) => {
        dep.dependents.push(absolutePath);
      });

      const title = result.title || ofTitle || defaultTitle;
      const name = 'docs';
      const id = toId(title, name);

      const docsEntry: DocsCacheEntry = {
        id,
        title,
        name,
        importPath,
        storiesImports: dependencies.map((dep) => dep.entries[0].importPath),
        type: 'docs',
      };
      return docsEntry;
    } catch (err) {
      logger.warn(`🚨 Extraction error on ${relativePath}: ${err}`);
      throw err;
    }
  }

  async extractStories(specifier: NormalizedStoriesSpecifier, absolutePath: Path) {
    const relativePath = path.relative(this.options.workingDir, absolutePath);
    const entries = [] as StoryIndexEntry[];
    try {
      const normalizedPath = normalizeStoryPath(relativePath);
      const importPath = slash(normalizedPath);
      const defaultTitle = autoTitleFromSpecifier(importPath, specifier);
      const csf = (await readCsfOrMdx(absolutePath, { defaultTitle })).parse();
      const storiesImports = await Promise.all(
        csf.imports.map(async (otherImport) =>
          otherImport.startsWith('.')
            ? slash(normalizeStoryPath(path.join(path.dirname(normalizedPath), otherImport)))
            : otherImport
        )
      );
      csf.stories.forEach(({ id, name, parameters }) => {
        const storyEntry: StoryIndexEntry = {
          id,
          title: csf.meta.title,
          name,
          importPath,
          storiesImports,
        };
        if (parameters?.docsOnly) storyEntry.type = 'docs';
        entries.push(storyEntry);
      });
    } catch (err) {
      if (err.name === 'NoMetaError') {
        logger.info(`💡 Skipping ${relativePath}: ${err}`);
      } else {
        logger.warn(`🚨 Extraction error on ${relativePath}: ${err}`);
        throw err;
      }
    }
    return { entries, type: 'stories', dependents: [] } as StoriesCacheEntry;
  }

  async sortStories(storiesList: StoryIndexEntry[]) {
    const entries: StoryIndex['entries'] = {};

    storiesList.forEach((entry) => {
      entries[entry.id] = entry;
    });

    const sortableStories = Object.values(entries);

    // Skip sorting if we're in v6 mode because we don't have
    // all the info we need here
    if (this.options.storyStoreV7) {
      const storySortParameter = await this.getStorySortParameter();
      const fileNameOrder = this.storyFileNames();
      sortStoriesV7(sortableStories, storySortParameter, fileNameOrder);
    }

    return sortableStories.reduce((acc, item) => {
      acc[item.id] = item;
      return acc;
    }, {} as StoryIndex['entries']);
  }

  async getIndex() {
    if (this.lastIndex) return this.lastIndex;

    // Extract any entries that are currently missing
    // Pull out each file's stories into a list of stories, to be composed and sorted
    const storiesList = await this.ensureExtracted();
    const sorted = await this.sortStories(storiesList);

    let compat = sorted;
    if (this.options.storiesV2Compatibility) {
      const titleToStoryCount = Object.values(sorted).reduce((acc, story) => {
        acc[story.title] = (acc[story.title] || 0) + 1;
        return acc;
      }, {} as Record<ComponentTitle, number>);

      compat = Object.entries(sorted).reduce((acc, entry) => {
        const [id, story] = entry;
        acc[id] = {
          ...story,
          id,
          kind: story.title,
          story: story.name,
          parameters: {
            __id: story.id,
            docsOnly: titleToStoryCount[story.title] === 1 && story.name === 'Page',
            fileName: story.importPath,
          },
        };
        return acc;
      }, {} as Record<StoryId, V2CompatIndexEntry>);
    }

    this.lastIndex = {
      v: 4,
      entries: compat,
    };

    return this.lastIndex;
  }

  invalidate(specifier: NormalizedStoriesSpecifier, importPath: Path, removed: boolean) {
    const absolutePath = slash(path.resolve(this.options.workingDir, importPath));
    const cache = this.specifierToCache.get(specifier);

    const cacheEntry = cache[absolutePath];
    let dependents = [];
    if (cacheEntry && cacheEntry.type === 'stories') {
      dependents = cacheEntry.dependents;
      // FIXME: might be in another cache
      dependents.forEach((dep) => {
        cache[dep] = false;
      });
    }

    if (removed) {
      delete cache[absolutePath];
    } else {
      cache[absolutePath] = false;
    }
    this.lastIndex = null;
  }

  async getStorySortParameter() {
    const previewFile = ['js', 'jsx', 'ts', 'tsx']
      .map((ext) => path.join(this.options.configDir, `preview.${ext}`))
      .find((fname) => fs.existsSync(fname));
    let storySortParameter;
    if (previewFile) {
      const previewCode = (await fs.readFile(previewFile, 'utf-8')).toString();
      storySortParameter = await getStorySortParameter(previewCode);
    }

    return storySortParameter;
  }

  // Get the story file names in "imported order"
  storyFileNames() {
    return Array.from(this.specifierToCache.values()).flatMap((r) => Object.keys(r));
  }
}

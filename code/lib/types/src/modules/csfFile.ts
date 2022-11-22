// A CSF file as processed by the story store

import type {
  ComponentAnnotations,
  ComponentId,
  ComponentTitle,
  Path,
  StoryAnnotations,
  StoryFn,
  StoryId,
  StoryName,
  StrictArgTypes,
  StrictGlobalTypes,
} from './csf';

export type ModuleExport = any;
export type ModuleExports = Record<string, ModuleExport>;
export type ModuleImportFn = (path: Path) => Store_PromiseLike<ModuleExports>;

export type NormalizedProjectAnnotations<TRenderer extends Renderer = Renderer> =
  ProjectAnnotations<TRenderer> & {
    argTypes?: StrictArgTypes;
    globalTypes?: StrictGlobalTypes;
  };

export type NormalizedComponentAnnotations<TRenderer extends Renderer = Renderer> =
  ComponentAnnotations<TRenderer> & {
    // Useful to guarantee that id & title exists
    id: ComponentId;
    title: ComponentTitle;
    argTypes?: StrictArgTypes;
  };

export type NormalizedStoryAnnotations<TRenderer extends Renderer = Renderer> = Omit<
  StoryAnnotations<TRenderer>,
  'storyName' | 'story'
> & {
  moduleExport: ModuleExport;
  // You cannot actually set id on story annotations, but we normalize it to be there for convience
  id: StoryId;
  argTypes?: StrictArgTypes;
  name: StoryName;
  userStoryFn?: StoryFn<TRenderer>;
};

export type CSFFile<TRenderer extends Renderer = Renderer> = {
  meta: NormalizedComponentAnnotations<TRenderer>;
  stories: Record<StoryId, NormalizedStoryAnnotations<TRenderer>>;
};

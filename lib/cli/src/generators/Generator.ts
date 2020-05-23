import { NpmOptions } from '../NpmOptions';
import { StoryFormat, SupportedLanguage } from '../project_types';

export type GeneratorOptions = {
  language: SupportedLanguage;
  storyFormat: StoryFormat;
};

export type Generator = (npmOptions: NpmOptions, options: GeneratorOptions) => Promise<void>;

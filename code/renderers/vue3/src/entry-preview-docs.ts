import { enhanceArgTypes, extractComponentDescription } from '@storybook/docs-tools';
import type { ArgTypesEnhancer } from '@storybook/types';
import { extractArgTypes } from './docs/extractArgTypes';
import { sourceCodeDecorator } from './docs/source-code-generator';
import { sourceDecorator } from './docs/sourceDecorator';
import type { VueRenderer } from './types';

export const parameters = {
  docs: {
    story: { inline: true },
    extractArgTypes,
    extractComponentDescription,
  },
};

// TODO: check with Storybook maintainers how to release the new decorator.
// Maybe as opt-in parameter for now which might become the default in future Storybook
// versions once its well tested by projects.
// Or add another type to the "SourceType" enum for this
const codeSnippetType = 'new' as 'legacy' | 'new';
const codeDecoratorToUse = codeSnippetType === 'legacy' ? sourceDecorator : sourceCodeDecorator;

export const decorators = [codeDecoratorToUse];

export const argTypesEnhancers: ArgTypesEnhancer<VueRenderer>[] = [enhanceArgTypes];

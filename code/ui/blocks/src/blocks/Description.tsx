import type { FC } from 'react';
import React, { useContext } from 'react';
import { str } from '@storybook/docs-tools';
import { deprecate } from '@storybook/client-logger';
import { Description } from '../components';

import type { DocsContextProps } from './DocsContext';
import { DocsContext } from './DocsContext';
import type { Component } from './types';
import { PRIMARY_STORY } from './types';
import { useOf } from './useOf';

export enum DescriptionType {
  INFO = 'info',
  NOTES = 'notes',
  DOCGEN = 'docgen',
  AUTO = 'auto',
}

type Notes = string | any;
type Info = string | any;

interface DescriptionProps {
  of?: any;
  /**
   * @deprecated Manually specifying description type is deprecated. In the future all descriptions will be extracted from JSDocs on the meta, story or component.
   */
  type?: DescriptionType;
  /**
   * @deprecated The 'markdown' prop on the Description block is deprecated. Write the markdown directly in the .mdx file instead
   */
  markdown?: string;
  /**
   * @deprecated The 'children' prop on the Description block is deprecated. Write the markdown directly in the .mdx file instead
   */
  children?: string;
}

const getNotes = (notes?: Notes) =>
  notes && (typeof notes === 'string' ? notes : str(notes.markdown) || str(notes.text));

const getInfo = (info?: Info) => info && (typeof info === 'string' ? info : str(info.text));

const noDescription = (component?: Component): string | null => null;

const getDescriptionFromModuleExport = (
  of: DescriptionProps['of'] = 'meta',
  docsContext: DocsContextProps<any>
): string => {
  const { projectAnnotations, ...resolvedModule } = useOf(of);
  console.log('LOG resolvedModule:', resolvedModule);
  console.log('LOG projectAnnotations:', projectAnnotations);
  switch (resolvedModule.type) {
    case 'story': {
      console.log('LOG story:', resolvedModule.story.parameters.docs?.description?.story);
      return resolvedModule.story.parameters.docs?.description?.story || '';
    }
    case 'meta': {
      const { meta } = resolvedModule.csfFile;
      console.log('LOG: meta', resolvedModule.csfFile);
      const metaDescription = meta.parameters.docs?.description?.component;
      if (metaDescription) {
        console.log('LOG: meta desc', metaDescription);
        return metaDescription;
      }
      console.log('LOG: component', meta.component);
      console.log(
        'LOG extract project:',
        projectAnnotations.parameters.docs?.extractComponentDescription
      );
      return (
        projectAnnotations.parameters.docs?.extractComponentDescription(meta.component, {
          component: meta.component,
          ...projectAnnotations.parameters,
          ...meta.parameters, // TODO: better merge?
        }) || null
      );
    }
    case 'component': {
      const { component } = resolvedModule;
      console.log(
        'LOG extract project:',
        projectAnnotations.parameters.docs?.extractComponentDescription
      );
      return (
        projectAnnotations.parameters.docs?.extractComponentDescription(component, {
          component,
          ...projectAnnotations.parameters,
        }) || null
      );
    }
    default: {
      throw new Error(
        `Unrecognized module type resolved from 'useOf', got: ${(resolvedModule as any).type}`
      );
    }
  }
};

const getDescriptionFromDeprecatedProps = (
  { type, markdown, children }: DescriptionProps,
  { storyById }: DocsContextProps<any>
): string => {
  const { component, parameters } = storyById();
  if (children || markdown) {
    return children || markdown;
  }
  const { notes, info, docs } = parameters;
  if (Boolean(notes) || Boolean(info)) {
    deprecate(
      "Using 'parameters.notes' or 'parameters.info' properties to describe stories is deprecated. Write JSDocs directly at the meta, story or component instead."
    );
  }

  const { extractComponentDescription = noDescription, description } = docs || {};

  // override component description
  const componentDescriptionParameter = description?.component;
  if (componentDescriptionParameter) {
    return componentDescriptionParameter;
  }

  switch (type) {
    case DescriptionType.INFO:
      return getInfo(info);
    case DescriptionType.NOTES:
      return getNotes(notes);
    case DescriptionType.DOCGEN:
    case DescriptionType.AUTO:
    default:
      return extractComponentDescription(component, { component, ...parameters });
  }
};

const DescriptionContainer: FC<DescriptionProps> = (props = { of: PRIMARY_STORY }) => {
  const context = useContext(DocsContext);
  let markdown;
  console.log('LOG: props', props);
  if (props.type || props.markdown || props.children) {
    // pre 7.0 mode with deprecated props
    markdown = getDescriptionFromDeprecatedProps(props, context);
  } else {
    // 7.0 mode with new 'of' prop
    // pre 7.0 with only 'of' prop only supported referencing a component, which 7.0 supports as well here
    markdown = getDescriptionFromModuleExport(props.of, context);
  }
  if (props.type) {
    deprecate(
      'Manually specifying description type is deprecated. In 7.0 all descriptions will be extracted from JSDocs on the meta, story or component.'
    );
  }
  if (props.markdown) {
    deprecate(
      "The 'markdown' prop on the Description block is deprecated. Write the markdown directly in the .mdx file instead"
    );
  }
  if (props.children) {
    deprecate(
      "The 'children' prop on the Description block is deprecated. Write the markdown directly in the .mdx file instead."
    );
  }
  return markdown ? <Description markdown={markdown} /> : null;
};

export { DescriptionContainer as Description };

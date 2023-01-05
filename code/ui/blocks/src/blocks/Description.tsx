import type { FC } from 'react';
import React, { useContext } from 'react';
import { str } from '@storybook/docs-tools';
import { deprecate } from '@storybook/client-logger';
import type { Meta, Story } from '@storybook/types';
import { Description } from '../components';

import type { DocsContextProps } from './DocsContext';
import { DocsContext } from './DocsContext';
import type { Component } from './types';
import { PRIMARY_STORY } from './types';

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
  of: DescriptionProps['of'],
  docsContext: DocsContextProps<any>
): string => {
  try {
    const storyId = docsContext.storyIdByModuleExport(of);
    console.log('LOG: storyId', storyId);
    // storyIdByModuleExport throws an error if 'of' doesn't reference a story
    // so we know that 'of' references a story, and we'll use that story's description
    const story = docsContext.storyById(storyId);
    console.log('LOG: story', story);
    return story.parameters.docs?.description?.story || '';
  } catch {
    // continue regardless of error
  }
  const primaryStory = docsContext.storyById();
  console.log('LOG: primaryStory', primaryStory);
  const { component, parameters } = primaryStory;

  const metaDescription = parameters.docs?.description?.component;

  // eslint-disable-next-line no-underscore-dangle
  if (of.__docgenInfo !== undefined || !metaDescription) {
    console.log('LOG: with __docgenInfo or not metaDescription');
    console.log('LOG: of', of);
    console.log('LOG: metaDescription', metaDescription);
    // 'of' references a component, or there's no description on meta, so we'll use the component's description
    const extractComponentDescription =
      parameters.docs?.extractComponentDescription || noDescription;
    return extractComponentDescription(component, {
      component,
      ...primaryStory.parameters,
    });
  }

  // 'of' references a meta and it has a description
  console.log('LOG: without __docgenInfo and metaDescription');
  console.log('LOG: of', of);
  console.log('LOG: metaDescription', metaDescription);
  return metaDescription;
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
  if (props.of && !(props.type || props.markdown || props.children)) {
    // 7.0 mode with new 'of' prop
    // pre 7.0 with only 'of' prop only supported referencing a component, which 7.0 supports as well here
    markdown = getDescriptionFromModuleExport(props.of, context);
  } else {
    // pre 7.0 mode with deprecated props
    markdown = getDescriptionFromDeprecatedProps(props, context);
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

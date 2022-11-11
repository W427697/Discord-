import type { FC } from 'react';
import React, { useContext } from 'react';
import { str } from '@storybook/docs-tools';
import type { DescriptionProps as PureDescriptionProps } from '../components';
import { Description } from '../components';

import type { DocsContextProps } from './DocsContext';
import { DocsContext } from './DocsContext';
import type { Component } from './types';
import { PRIMARY_STORY } from './types';
import { useDeprecate } from '../use-deprecate';

export enum DescriptionType {
  INFO = 'info',
  NOTES = 'notes',
  DOCGEN = 'docgen',
  AUTO = 'auto',
}

type Notes = string | any;
type Info = string | any;

interface DescriptionProps {
  of?: '.' | Component;
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

export const useDescriptionProps = (
  { of, type, markdown, children }: DescriptionProps,
  { storyById }: DocsContextProps<any>
): PureDescriptionProps => {
  const { component, parameters } = storyById();
  if (children || markdown) {
    return { markdown: children || markdown };
  }
  const { notes, info, docs } = parameters;
  useDeprecate(
    "Using 'parameters.notes' or 'parameters.info' properties to describe stories is deprecated. Write JSDocs directly at the meta, story or component instead.",
    Boolean(notes) || Boolean(info)
  );
  const { extractComponentDescription = noDescription, description } = docs || {};
  const target = [PRIMARY_STORY].includes(of) ? component : of;

  // override component description
  const componentDescriptionParameter = description?.component;
  if (componentDescriptionParameter) {
    return { markdown: componentDescriptionParameter };
  }

  switch (type) {
    case DescriptionType.INFO:
      return { markdown: getInfo(info) };
    case DescriptionType.NOTES:
      return { markdown: getNotes(notes) };
    case DescriptionType.DOCGEN:
    case DescriptionType.AUTO:
    default:
      return { markdown: extractComponentDescription(target, { component, ...parameters }) };
  }
};

const DescriptionContainer: FC<DescriptionProps> = (props = { of: PRIMARY_STORY }) => {
  const context = useContext(DocsContext);
  const { markdown } = useDescriptionProps(props, context);
  useDeprecate(
    'Manually specifying description type is deprecated. In the future all descriptions will be extracted from JSDocs on the meta, story or component.',
    Boolean(props.type)
  );
  useDeprecate(
    "The 'markdown' prop on the Description block is deprecated. Write the markdown directly in the .mdx file instead",
    Boolean(props.markdown)
  );
  useDeprecate(
    "The 'children' prop on the Description block is deprecated. Write the markdown directly in the .mdx file instead.",
    Boolean(props.children)
  );
  return markdown ? <Description markdown={markdown} /> : null;
};

export { DescriptionContainer as Description };

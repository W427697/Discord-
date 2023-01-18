/* eslint-disable react/destructuring-assignment */
import type { Parameters, Renderer, StrictArgTypes } from '@storybook/csf';
import type { ModuleExports } from '@storybook/types';
import type { FC } from 'react';
import type { PropDescriptor } from '@storybook/preview-api';
import { combineParameters, filterArgTypes } from '@storybook/preview-api';
import type { ArgTypesExtractor } from '@storybook/docs-tools';
import React from 'react';

import type { SortType } from '../components';
import { ArgsTable as PureArgsTable, ArgsTableError } from '../components';
import { useOf } from './useOf';

type ArgTypesParameters = {
  include?: PropDescriptor;
  exclude?: PropDescriptor;
  sort?: SortType;
};

type ArgTypesProps = ArgTypesParameters & {
  of: Renderer['component'] | ModuleExports;
};

// TODO: generalize
function extractComponentArgTypes(
  component: Renderer['component'],
  parameters: Parameters
): StrictArgTypes {
  const { extractArgTypes }: { extractArgTypes: ArgTypesExtractor } = parameters.docs || {};
  if (!extractArgTypes) {
    throw new Error(ArgsTableError.ARGS_UNSUPPORTED);
  }
  return extractArgTypes(component);
}

function getArgTypesFromResolved(resolved: ReturnType<typeof useOf>, props: ArgTypesProps) {
  if (resolved.type === 'component') {
    const {
      component,
      projectAnnotations: { parameters },
    } = resolved;
    return {
      argTypes: extractComponentArgTypes(component, parameters),
      parameters,
    };
  }

  if (resolved.type === 'meta') {
    const {
      preparedMeta: { component, argTypes, parameters },
    } = resolved;
    const componentArgTypes = component && extractComponentArgTypes(component, parameters);
    const metaArgTypes = filterArgTypes(argTypes, props.include, props.exclude);
    return {
      argTypes: combineParameters(componentArgTypes, metaArgTypes) as StrictArgTypes,
      parameters,
    };
  }

  // In the case of the story, the enhanceArgs argTypeEnhancer has already added the extracted
  // arg types from the component to the prepared story.
  const {
    story: { argTypes, parameters },
  } = resolved;
  return { argTypes, parameters };
}

export const ArgTypes: FC<ArgTypesProps> = (props) => {
  const { of } = props;
  const resolved = useOf(of || 'meta');
  const { argTypes, parameters } = getArgTypesFromResolved(resolved, props);
  const argTypesParameters = parameters.docs?.argTypes || ({} as ArgTypesParameters);

  const include = props.include ?? argTypesParameters.include;
  const exclude = props.exclude ?? argTypesParameters.exclude;
  const sort = props.sort ?? argTypesParameters.sort;

  const filteredArgTypes = filterArgTypes(argTypes, include, exclude);

  return <PureArgsTable rows={filteredArgTypes} sort={sort} />;
};

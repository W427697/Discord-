/* eslint-disable prefer-template */
import React from 'react';
import addons, { makeDecorator } from '@storybook/addons';
import _ from 'lodash/fp';
import { inspect } from 'util';
import { EVENT_ID } from './consts';

interface Props {
  [key: string]: unknown;
}

export const JSX = makeDecorator({
  name: 'JSX',
  parameterName: null,
  skipIfNoParametersOrOptions: false,
  wrapper: (getStory, context) => {
    const story = getStory(context);

    const storySource = getComponentRepresentation(story);

    const channel = addons.getChannel();
    channel.emit(EVENT_ID, { storySource });

    return story;
  },
});

const getSpaces = (depth: number) => _.repeat(depth * 4, '\u00a0');

const getArrayOfAllNonDefaultProps = (props: Props, defaultProps: Props) =>
  _.toPairs(props).filter(([name, value]) => !defaultProps || defaultProps[name] !== value);

const getFuncName = (value: Function) => value.name || 'anonymous';
const isObject = (value: unknown) => _.isObject(value) && !_.isArray(value);

const renderValue = _.cond([
  [_.isFunction, getFuncName],
  [isObject, objToString],
  [_.stubTrue, inspect],
]);

function objToString(obj: object) {
  const representation: string = _.toPairs(obj)
    .map(([key, value]) => `${key}: ${isObject(value) ? objToString(value) : renderValue(value)}`)
    .join(', ');

  return `{${representation}}`;
}

function getComponentRepresentation(story: any) {
  const name = story.type.displayName || story.type.name;
  const props = getArrayOfAllNonDefaultProps(story.props, story.type.defaultProps);

  if (props.length === 0) {
    return `<${name}/>\n`;
  }

  const propsWithoutChildren = props.filter(([prop]) => prop !== 'children');
  const propsRepresentation = propsWithoutChildren
    .map(
      ([prop, value]) =>
        getSpaces(1) + (value === true ? prop : `${prop}={${renderValue(value)}}`) + '\n'
    )
    .join('');

  const childRepresentation: string =
    story.props.children &&
    React.Children.map(story.props.children, child =>
      _.isObject(child)
        ? getComponentRepresentation(child)
            .split('\n')
            .map(x => x && getSpaces(1) + x)
            .join('\n')
        : getSpaces(1) + child + '\n'
    ).join('');

  return [
    `<${name}`,
    propsRepresentation && '\n' + propsRepresentation,
    !childRepresentation && '/>\n',
    childRepresentation && '>\n' + childRepresentation + `</${name}>\n`,
  ]
    .filter(_.identity)
    .join('');
}

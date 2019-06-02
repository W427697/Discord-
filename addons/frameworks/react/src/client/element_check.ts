import React, { ReactNode } from 'react';
import flattenDeep from 'lodash/flattenDeep';

// return true if the element is renderable with react fiberss
export const isValidFiberElement = (element: ReactNode) =>
  typeof element === 'string' || typeof element === 'number' || React.isValidElement(element);

export const isPriorToFiber = (version: string) => {
  const [majorVersion] = version.split('.');

  return Number(majorVersion) < 16;
};

// accepts an element and return true if renderable else return false
const isReactRenderable = (element: ReactNode): boolean => {
  // storybook is running with a version prior to fiber,
  // run a simple check on the element
  if (isPriorToFiber(React.version)) {
    return React.isValidElement(element);
  }

  // the element is not an array, check if its a fiber renderable element
  if (!Array.isArray(element)) {
    return isValidFiberElement(element);
  }

  // the element is in fact a list of elements (array),
  // loop on its elements to see if its ok to render them
  return element.every(isReactRenderable);
};

export default isReactRenderable;

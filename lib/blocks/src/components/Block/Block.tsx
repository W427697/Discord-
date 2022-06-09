import clsx from 'clsx';
import React from 'react';
import { Box } from '../../primitives';
import { BlockVariants, getRecipe } from './Block.css';

/**
 * Use Block component to visually separate and elevate it from other content
 */
export const Block: React.FC<BlockVariants> = ({ appearance, children }) => {
  const classNames = clsx(
    'docblock-block', // This can be used to target using selectors
    appearance === 'empty' && 'docblock-emptyblock', // TODO: Do we need this for backward compat?
    getRecipe({ appearance })
  );
  return <Box className={classNames}>{children}</Box>;
};

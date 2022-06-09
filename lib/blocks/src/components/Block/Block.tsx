import React from 'react';
import { Box } from '../../primitives';
import { BlockVariants, getRecipe } from './Block.css';

/**
 * Use Block component to visually separate and elevate it from other content
 */
export const Block: React.FC<BlockVariants> = ({ appearance, children }) => {
  return <Box className={getRecipe({ appearance })}>{children}</Box>;
};

import { GenericParser } from './generic-parser';
import type { Parser, SupportedRenderer } from './types';

/**
 * Get the parser for a given renderer
 * @param renderer The renderer to get the parser for
 * @returns The parser for the renderer
 */
export function getParser(renderer: SupportedRenderer): Parser {
  switch (renderer) {
    default:
      return new GenericParser();
  }
}

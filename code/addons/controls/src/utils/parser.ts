import { CommonParser } from './parser/common';

export type SupportedRenderer = 'react';

export type ParserResult = {
  exports: Array<{
    name: string;
    default: boolean;
  }>;
};

export interface Parser {
  parse: (content: string) => Promise<ParserResult>;
}

export function getParser(renderer: SupportedRenderer): Parser {
  switch (renderer) {
    default:
      return new CommonParser();
  }
}

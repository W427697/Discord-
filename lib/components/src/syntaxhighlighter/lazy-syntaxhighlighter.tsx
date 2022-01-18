import React, { Suspense } from 'react';
import { SyntaxHighlighterProps } from '..';

const LazySyntaxHighlighter = React.lazy(() => import('./syntaxhighlighter'));

export const SyntaxHighlighter = (props: SyntaxHighlighterProps) => (
  <Suspense fallback={<div />}>
    <LazySyntaxHighlighter {...props} />
  </Suspense>
);

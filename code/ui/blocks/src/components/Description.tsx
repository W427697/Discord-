import type { FC } from 'react';
import React from 'react';
import Markdown from 'markdown-to-jsx'; // eslint-disable-line import/no-extraneous-dependencies
import { components, ResetWrapper } from '@storybook/components'; // eslint-disable-line import/no-extraneous-dependencies

export interface DescriptionProps {
  markdown: string;
}

/**
 * A markdown description for a component, typically used to show the
 * components docgen docs.
 */
export const Description: FC<DescriptionProps> = ({ markdown }) => (
  <ResetWrapper>
    <Markdown options={{ forceBlock: true, overrides: components }}>{markdown}</Markdown>
  </ResetWrapper>
);

import React, { FC } from 'react';
import { docsEscapeHatch } from '@storybook/components';

export const anchorBlockIdFromId = (storyId: string) => `anchor--${storyId}`;

export interface AnchorProps {
  storyId: string;
}

export const Anchor: FC<AnchorProps> = ({ storyId, children }) => (
  <div id={anchorBlockIdFromId(storyId)} className={docsEscapeHatch(Anchor)}>
    {children}
  </div>
);

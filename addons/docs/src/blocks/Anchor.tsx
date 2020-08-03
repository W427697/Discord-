import React, { FC } from 'react';

export const anchorBlockIdFromId = (storyId: string) => `anchor--${storyId}`;

export interface AnchorProps {
  storyId: string;
  className?: string;
}

export const Anchor: FC<AnchorProps> = ({ storyId, children, className }) => (
  <div className={className} id={anchorBlockIdFromId(storyId)}>
    {children}
  </div>
);

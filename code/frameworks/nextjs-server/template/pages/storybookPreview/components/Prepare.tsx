'use client';

import React, { useEffect } from 'react';
import { STORY_PREPARED } from '@storybook/nextjs-server/core-events';
import type {
  Args,
  Parameters,
  StoryId,
  StrictArgTypes,
  PlayFunction,
  ReactRenderer,
} from '@storybook/nextjs-server/types';
import { addons } from '@storybook/nextjs-server/preview-api';

export type StoryAnnotations<TArgs extends Args> = {
  id: StoryId;
  parameters: Parameters;
  argTypes: StrictArgTypes<TArgs>;
  initialArgs: TArgs;
  args: TArgs;
  play?: PlayFunction<ReactRenderer, TArgs>;
};

// A component to emit the prepared event and run the play function
export function Prepare<TArgs extends Args>({
  story,
  canvasElement,
}: {
  story: StoryAnnotations<TArgs>;
  canvasElement: HTMLElement;
}) {
  const channel = addons.getChannel();
  useEffect(() => {
    if (story) {
      channel.emit(STORY_PREPARED, { ...story });
    }
  }, [channel, story]);

  useEffect(() => {
    if (story?.play && canvasElement) {
      story.play({ ...story, canvasElement } as any);
    }
  }, [story]);

  return <></>;
}

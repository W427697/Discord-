import dedent from 'ts-dedent';
import { defineError } from './define-error';

export enum Category {
  PREVIEW_API = 'PREVIEW_API',
}

export const MISSING_STORY_AFTER_HMR = defineError({
  category: Category.PREVIEW_API,
  code: 1,
  telemetry: true,
  template: ({
    storyId,
  }: {
    storyId: string;
  }) => dedent`Couldn't find story matching '${storyId}' after HMR.
  - Did you just rename a story?
  - Did you remove it from your CSF file?
  - Are you sure a story with that id exists?
  - Please check the stories field of your main.js config.
  - Also check the browser console and terminal for potential error messages.`,
});

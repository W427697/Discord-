import { STORY_CHANGED, STORY_ERRORED, STORY_MISSING } from '@storybook/core-events';
import { ObjType } from './types';

const DEFAULT_EVENT_MAPPING: ObjType = {
  [STORY_CHANGED]: true,
  [STORY_ERRORED]: true,
  [STORY_MISSING]: true,
};

export default DEFAULT_EVENT_MAPPING;

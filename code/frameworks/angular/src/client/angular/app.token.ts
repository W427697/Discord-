import { InjectionToken } from '@angular/core';
import type { StoryFnAngularReturnType } from '../types';

export const STORY = new InjectionToken<StoryFnAngularReturnType>('story');

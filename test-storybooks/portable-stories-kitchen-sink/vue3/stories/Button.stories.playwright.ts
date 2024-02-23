import { composeStories, composeStory } from '@storybook/vue3';
import * as stories from './Button.stories';

// export default composeStories(stories);

export const Single = composeStory(stories.CSF3Primary, stories.default);
export const SingleWithRender = composeStory(stories.CSF3ButtonWithRender, stories.default);

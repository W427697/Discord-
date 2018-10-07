import { NgStoryModule } from '@storybook/angular';
import { WelcomStory } from './welcom.stories';
import { WithTextStory } from './with-text.stories';
import { WithSomeEmojiStory } from './with-some-emoji.stories';

@NgStoryModule({
  stories: [WelcomStory, WithTextStory, WithSomeEmojiStory],
})
export class StoryRootModule {}

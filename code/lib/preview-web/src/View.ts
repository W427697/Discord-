/* eslint-disable camelcase */
import type { Store_Story } from '@storybook/types';

export abstract class View<TRootElement> {
  // Get ready to render a story, returning the element to render to
  abstract prepareForStory(story: Store_Story<any>): TRootElement;

  abstract prepareForDocs(): TRootElement;

  abstract showErrorDisplay({ message = '', stack = '' }): void;

  abstract showNoPreview(): void;

  abstract showPreparingStory({ immediate = false }): void;

  abstract showPreparingDocs(): void;

  abstract showMain(): void;

  abstract showDocs(): void;

  abstract showStory(): void;

  abstract showStoryDuringRender(): void;
}

import { StoryFn } from "@storybook/addons";

export interface NgModuleMetadata {
  declarations?: any[];
  entryComponents?: any[];
  imports?: any[];
  schemas?: any[];
  providers?: any[];
}

declare module '@storybook/addon-centered/angular' {
  export function centered(story: StoryFn): ReturnType<StoryFn>;
}

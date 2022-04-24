export const ADDON_ID = 'addon-source' as const;
export const PARAM_KEY = 'source' as const;

// addon-docs
export const SNIPPET_RENDERED = `storybook/docs/snippet-rendered`;
export const CURRENT_SELECTION = '.';

export enum SourceType {
  /**
   * AUTO is the default
   *
   * Use the CODE logic if:
   * - the user has set a custom source snippet in `docs.source.code` story parameter
   * - the story is not an args-based story
   *
   * Use the DYNAMIC rendered snippet if the story is an args story
   */
  AUTO = 'auto',

  /**
   * Render the code extracted by source-loader
   */
  CODE = 'code',

  /**
   * Render dynamically-rendered source snippet from the story's virtual DOM (currently React only)
   */
  DYNAMIC = 'dynamic',
}

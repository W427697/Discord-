export abstract class StorybookError extends Error {
  /**
   * Category of the error. Used to classify the type of error, e.g., 'PREVIEW_API'.
   */
  abstract readonly category: string;

  /**
   * Code representing the error. Used to uniquely identify the error, e.g., 1.
   */
  abstract readonly code: number;

  /**
   * A properly written error message template for this error.
   * @see https://github.com/storybookjs/storybook/blob/next/code/lib/core-events/src/errors/README.md#how-to-write-a-proper-error-message
   */
  abstract template(): string;

  /**
   * Indicates whether telemetry data should be collected for this error.
   */
  public telemetry = false;

  /**
   * Specifies the documentation for the error.
   * - If `true`, links to a documentation page on the Storybook website (make sure it exists before enabling).
   * - If a string, uses the provided URL for documentation (external or FAQ links).
   * - If `false` (default), no documentation link is added.
   */
  public documentation: boolean | string = false;

  /**
   * Flag used to easily determine if the error originates from Storybook.
   */
  protected fromStorybook = true;

  // used for metadata purposes and to build the error page link
  private fullCode: string;

  constructor() {
    super();
    this.fullCode = this.name;
  }

  get paddedCode() {
    return this.code.toString().padStart(4, '0');
  }

  /**
   * Overrides the default `Error.name` property in the format: SB_<CATEGORY>_<CODE>.
   * @returns {string} Full error name.
   */
  get name() {
    return `SB_${this.category}_${this.paddedCode}` as `SB_${this['category']}_${this['code']}`;
  }

  /**
   * Generates the error message along with additional documentation link (if applicable).
   * @returns {string} The formatted error message.
   */
  get message() {
    let page: string | undefined;

    if (this.documentation === true) {
      page = `https://storybook.js.org/error/${this.fullCode}`;
    } else if (typeof this.documentation === 'string') {
      page = this.documentation;
    }

    return this.template() + (page != null ? `\n\nMore info: ${page}` : '');
  }
}

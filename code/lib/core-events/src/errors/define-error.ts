declare global {
  function telemetry({
    isError,
    payload,
  }:
    | {
        isError: true;
        payload: StorybookError;
      }
    | {
        isError: false;
        payload: unknown;
      }): void;
}

// StorybookError, to keep metadata in its object which can be used in telemetry
export class StorybookError extends Error {
  constructor(public category: string, public code: string, message: string) {
    super(message);
  }
}

export function defineError<Template extends string | ((...data: any[]) => string)>({
  category,
  code: numberedCode,
  template,
  documentation,
  telemetry,
}: {
  category: string;
  code: number;
  /**
   * A properly written error message, see: bla.
   * @see https://github.com/storybookjs/storybook/blob/next/code/lib/core-events/src/errors/README.md#how-to-write-a-proper-error-message
   */
  template: Template;
  // either true or a link to a specific documentation
  documentation?: boolean | string;
  telemetry?: boolean;
}) {
  type Data = Template extends (...data: any[]) => string ? Parameters<Template> : [_?: undefined];

  let page: string;
  // turn e.g. 1 into 0001
  const code = numberedCode.toString().padStart(4, '0');
  if (documentation && documentation === true) {
    page = `https://storybook.js.org/error/${code}`;
  } else if (documentation && typeof documentation === 'string') {
    page = documentation;
  }

  // e.g. SB_PREVIEW_API_0001
  const fullCode = `[SB_${category}_${code}]`;

  const message = documentation
    ? (...data: Data) =>
        `${fullCode} ${
          typeof template === 'function' ? template(...data) : template
        }\n\nMore info: ${page}`
    : (...data: Data) =>
        `${fullCode} ${typeof template === 'function' ? template(...data) : template}`;

  const error = (...data: Data) => {
    const storybookError = new StorybookError(category, code, message(...data));
    // telemetry would be injected globally and accessed to send errors if needed
    if (telemetry && globalThis.telemetry) {
      globalThis.telemetry({
        isError: true,
        payload: storybookError,
      });
    }

    return storybookError;
  };

  return { code, category, error };
}

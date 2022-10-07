declare module '@storybook/preview-web/dist/PreviewWeb.mockdata';

declare class AnsiToHtml {
  constructor(options: { escapeHtml: boolean });

  toHtml: (ansi: string) => string;
}

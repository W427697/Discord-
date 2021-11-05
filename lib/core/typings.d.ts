declare module 'ansi-to-html';
declare module '@storybook/core-common';

declare class AnsiToHtml {
  constructor(options: { escapeHtml: boolean });

  toHtml: (ansi: string) => string;
}

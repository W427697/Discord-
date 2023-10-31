import { css } from '@storybook/theming';

export const sbTheme = css`
  @media (prefers-color-scheme: light) {
    :root {
      --sb-sidebar-bg: #f6f9fc;
    }
  }

  @media (prefers-color-scheme: dark) {
    :root {
      --sb-sidebar-bg: #222425;
    }
  }
`;

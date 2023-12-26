import type { ThemeVars } from '@storybook/theming';
import { css, themes } from '@storybook/theming';

export const isThemeDifferentFromDefaultTheme = (base: 'light' | 'dark', theme: ThemeVars) => {
  if (theme) {
    if (themes[base].base !== theme.base) return false;
    if (themes[base].colorPrimary !== theme.colorPrimary) return true;
    if (themes[base].colorSecondary !== theme.colorSecondary) return true;
    if (themes[base].appBg !== theme.appBg) return true;
    if (themes[base].appContentBg !== theme.appContentBg) return true;
    if (themes[base].appBorderColor !== theme.appBorderColor) return true;
    if (themes[base].appBorderRadius !== theme.appBorderRadius) return true;
    if (themes[base].fontBase !== theme.fontBase) return true;
    if (themes[base].fontCode !== theme.fontCode) return true;
    if (themes[base].textColor !== theme.textColor) return true;
    if (themes[base].textInverseColor !== theme.textInverseColor) return true;
    if (themes[base].textMutedColor !== theme.textMutedColor) return true;
    if (themes[base].barTextColor !== theme.barTextColor) return true;
    if (themes[base].barHoverColor !== theme.barHoverColor) return true;
    if (themes[base].barSelectedColor !== theme.barSelectedColor) return true;
    if (themes[base].buttonBg !== theme.buttonBg) return true;
    if (themes[base].buttonBorder !== theme.buttonBorder) return true;
    if (themes[base].booleanBg !== theme.booleanBg) return true;
    if (themes[base].booleanSelectedBg !== theme.booleanSelectedBg) return true;
    if (themes[base].inputBg !== theme.inputBg) return true;
    if (themes[base].inputBorder !== theme.inputBorder) return true;
    if (themes[base].inputTextColor !== theme.inputTextColor) return true;
    if (themes[base].inputBorderRadius !== theme.inputBorderRadius) return true;
  }
  return false;
};

export const convertThemeV1intoV2 = (theme: ThemeVars) => {
  return css`
    @media (prefers-color-scheme: light) {
      :root {
        --sb-sidebar-background: ${theme.appBg || themes.light.appBg};
      }
    }
    @media (prefers-color-scheme: dark) {
      :root {
        --sb-sidebar-background: ${theme.appBg || themes.dark.appBg};
      }
    }
  `;
};

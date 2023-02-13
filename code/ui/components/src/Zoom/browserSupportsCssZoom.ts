import { global } from '@storybook/global';

export function browserSupportsCssZoom(): boolean {
  try {
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if (!isSafari) {
      // @ts-expect-error (we're testing for browser support)
      return global.document.implementation.createHTMLDocument('').body.style.zoom !== undefined;
    }
    return false;
  } catch (error) {
    return false;
  }
}

import { global } from '@storybook/global';

export function browserSupportsCssZoom(): boolean {
  try {
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    // @ts-expect-error (we're testing for browser support)
    if (!isSafari) {
      return global.document.implementation.createHTMLDocument('').body.style.zoom !== undefined;
    } else return false
  } catch (error) {
    return false;
  }
}

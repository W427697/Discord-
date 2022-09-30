export function browserSupportsCssZoom(): boolean {
  try {
    // @ts-expect-error nonstandard, safari only
    return globalThis.document.implementation.createHTMLDocument('').body.style.zoom !== undefined;
  } catch (error) {
    return false;
  }
}

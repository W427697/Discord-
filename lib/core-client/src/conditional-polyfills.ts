import { window } from 'global';

export const importPolyfills = () => {
  const polyfills = [];

  // TODO: make these conditional
  // @ts-ignore
  polyfills.push(import('regenerator-runtime/runtime'));
  // @ts-ignore
  polyfills.push(import('airbnb-js-shims'));
  // @ts-ignore
  polyfills.push(import('core-js/features/symbol'));

  if (!window.fetch) {
    // manually patch window.fetch;
    //    see issue: <https://github.com/developit/unfetch/issues/101#issuecomment-454451035>
    const patch = ({ default: fetch }: any) => {
      window.fetch = fetch;
    };

    polyfills.push(import('unfetch/dist/unfetch').then(patch));
  }

  return Promise.all(polyfills);
};

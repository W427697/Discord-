import { window } from 'global';

export const importPolyfills = () => {
  const polyfills = [];

  if (!window.fetch) {
    // manually patch window.fetch;
    //    see issue: <https://github.com/developit/unfetch/issues/101#issuecomment-454451035>
    // todo needs review
    polyfills.push(
      import('unfetch').then(res => {
        window.fetch = res.default;
      })
    );
  }

  return Promise.all(polyfills);
};

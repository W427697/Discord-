import { fn } from '@storybook/test';
import { RequestCookies } from 'next/dist/compiled/@edge-runtime/cookies';
// We need this import to be a singleton, and because it's used in multiple entrypoints
// both in ESM and CJS, importing it via the package name instead of having a local import
// is the only way to achieve it actually being a singleton
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore we must ignore types here as during compilation they are not generated yet
import { headers } from '@storybook/nextjs/headers.mock';

class RequestCookiesMock extends RequestCookies {
  get = fn(super.get).mockName('next/headers::get');

  getAll = fn(super.getAll).mockName('next/headers::cookies().getAll');

  has = fn(super.has).mockName('next/headers::cookies().has');

  set = fn(super.set).mockName('next/headers::cookies().set');

  delete = fn(super.delete).mockName('next/headers::cookies().delete');
}

let requestCookiesMock: RequestCookiesMock;

export const cookies = fn(() => {
  if (!requestCookiesMock) {
    requestCookiesMock = new RequestCookiesMock(headers());
  }
  return requestCookiesMock;
}).mockName('next/headers::cookies()');

const originalRestore = cookies.mockRestore.bind(null);

// will be called automatically by the test loader
cookies.mockRestore = () => {
  originalRestore();
  headers.mockRestore();
  requestCookiesMock = new RequestCookiesMock(headers());
};

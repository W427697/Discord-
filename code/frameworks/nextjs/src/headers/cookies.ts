/* eslint-disable no-underscore-dangle */
import { fn } from '@storybook/test';
import type { RequestCookies } from 'next/dist/compiled/@edge-runtime/cookies';
import {
  parseCookie,
  stringifyCookie,
  type RequestCookie,
} from 'next/dist/compiled/@edge-runtime/cookies';
// We need this import to be a singleton, and because it's used in multiple entrypoints
// both in ESM and CJS, importing it via the package name instead of having a local import
// is the only way to achieve it actually being a singleton
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore we must ignore types here as during compilation they are not generated yet
import { headers, type HeadersStore } from '@storybook/nextjs/headers.mock';

const stringifyCookies = (map: Map<string, RequestCookie>) => {
  return Array.from(map)
    .map(([_, v]) => stringifyCookie(v).replace(/; /, ''))
    .join('; ');
};

// Mostly copied from https://github.com/vercel/edge-runtime/blob/c25e2ded39104e2a3be82efc08baf8dc8fb436b3/packages/cookies/src/request-cookies.ts#L7
class CookieStore implements RequestCookies {
  /** @internal */
  private readonly _headers: HeadersStore;

  _parsed: Map<string, RequestCookie> = new Map();

  constructor(requestHeaders: HeadersStore) {
    this._headers = requestHeaders;
    const header = requestHeaders?.get('cookie');
    if (header) {
      const parsed = parseCookie(header);
      for (const [name, value] of parsed) {
        this._parsed.set(name, { name, value });
      }
    }
  }

  [Symbol.iterator]() {
    return this._parsed[Symbol.iterator]();
  }

  /** Used to restore the mocks. Called internally by @storybook/nextjs
   * to ensure that the mocks are restored between stories.
   * @internal
   * */
  mockRestore = () => {
    this.clear();
    this._headers.mockRestore();
  };

  get size(): number {
    return this._parsed.size;
  }

  get = fn((...args: [name: string] | [RequestCookie]) => {
    const name = typeof args[0] === 'string' ? args[0] : args[0].name;
    return this._parsed.get(name);
  }).mockName('cookies().get');

  getAll = fn((...args: [name: string] | [RequestCookie] | []) => {
    const all = Array.from(this._parsed);
    if (!args.length) {
      return all.map(([_, value]) => value);
    }

    const name = typeof args[0] === 'string' ? args[0] : args[0]?.name;
    return all.filter(([n]) => n === name).map(([_, value]) => value);
  }).mockName('cookies().getAll');

  has = fn((name: string) => {
    return this._parsed.has(name);
  }).mockName('cookies().has');

  set = fn((...args: [key: string, value: string] | [options: RequestCookie]): this => {
    const [name, value] = args.length === 1 ? [args[0].name, args[0].value] : args;

    const map = this._parsed;
    map.set(name, { name, value });

    this._headers.set('cookie', stringifyCookies(map));
    return this;
  }).mockName('cookies().set');

  /**
   * Delete the cookies matching the passed name or names in the request.
   */
  delete = fn(
    (
      /** Name or names of the cookies to be deleted  */
      names: string | string[]
    ): boolean | boolean[] => {
      const map = this._parsed;
      const result = !Array.isArray(names)
        ? map.delete(names)
        : names.map((name) => map.delete(name));
      this._headers.set('cookie', stringifyCookies(map));
      return result;
    }
  ).mockName('cookies().delete');

  /**
   * Delete all the cookies in the cookies in the request.
   */
  clear = fn((): this => {
    this.delete(Array.from(this._parsed.keys()));
    return this;
  }).mockName('cookies().clear');

  /**
   * Format the cookies in the request as a string for logging
   */
  [Symbol.for('edge-runtime.inspect.custom')]() {
    return `RequestCookies ${JSON.stringify(Object.fromEntries(this._parsed))}`;
  }

  toString() {
    return [...this._parsed.values()]
      .map((v) => `${v.name}=${encodeURIComponent(v.value)}`)
      .join('; ');
  }
}

let cookieStore: CookieStore;

export const cookies = (): CookieStore => {
  if (!cookieStore) {
    cookieStore = new CookieStore(headers());
  }
  return cookieStore;
};

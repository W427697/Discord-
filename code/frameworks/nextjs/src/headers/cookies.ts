/* eslint-disable no-underscore-dangle */
import { fn } from '@storybook/test';
import { headers } from './headers';
import {
  parseCookie,
  stringifyCookie,
  type RequestCookie,
} from 'next/dist/compiled/@edge-runtime/cookies';

// Mostly copied from https://github.com/vercel/edge-runtime/blob/c25e2ded39104e2a3be82efc08baf8dc8fb436b3/packages/cookies/src/request-cookies.ts#L7
class CookieStore {
  /** @internal */
  readonly _headers?: Headers;

  store = new Map();

  _parsed: Map<string, RequestCookie> = new Map();

  constructor(requestHeaders?: Headers) {
    this._headers = requestHeaders;
    const header = requestHeaders?.get('cookie');
    if (header) {
      const parsed = parseCookie(header);
      for (const [name, value] of parsed) {
        this._parsed.set(name, { name, value });
      }
    }
  }

  /** @internal */
  mockRestore = () => {
    this.clear();
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

    this._headers?.set(
      'cookie',
      Array.from(map)
        .map(([_, v]) => stringifyCookie(v))
        .join('; ')
    );
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
      this._headers?.set(
        'cookie',
        Array.from(map)
          .map(([_, value]) => stringifyCookie(value))
          .join('; ')
      );
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
}

let cookieStore: CookieStore;

export const cookies = (): CookieStore => {
  if (!cookieStore) {
    cookieStore = new CookieStore(headers());
  }
  return cookieStore;
};

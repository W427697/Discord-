import { fn } from '@storybook/test';
import type { IncomingHttpHeaders } from 'http';
import type { HeadersAdapter } from 'next/dist/server/web/spec-extension/adapters/headers';

// Mostly copied from https://github.com/vercel/next.js/blob/763b9a660433ec5278a10e59d7ae89d4010ba212/packages/next/src/server/web/spec-extension/adapters/headers.ts#L20
// @ts-expect-error unfortunately the headers property is private (and not protected) in HeadersAdapter
// and we can't access it so we need to redefine it, but that clashes with the type, hence the ts-expect-error comment.
export class HeadersStore extends Headers implements HeadersAdapter {
  private headers: IncomingHttpHeaders = {};

  /** @internal */
  mockRestore = () => {
    this.forEach((key) => this.delete(key));
  };

  /**
   * Merges a header value into a string. This stores multiple values as an
   * array, so we need to merge them into a string.
   *
   * @param value a header value
   * @returns a merged header value (a string)
   */
  private merge(value: string | string[]): string {
    if (Array.isArray(value)) return value.join(', ');

    return value;
  }

  public append = fn((name: string, value: string): void => {
    const existing = this.headers[name];
    if (typeof existing === 'string') {
      this.headers[name] = [existing, value];
    } else if (Array.isArray(existing)) {
      existing.push(value);
    } else {
      this.headers[name] = value;
    }
  }).mockName('headers().append');

  public delete = fn((name: string) => {
    delete this.headers[name];
  }).mockName('headers().delete');

  public get = fn((name: string): string | null => {
    const value = this.headers[name];
    if (typeof value !== 'undefined') return this.merge(value);

    return null;
  }).mockName('headers().get');

  public has = fn((name: string): boolean => {
    return typeof this.headers[name] !== 'undefined';
  }).mockName('headers().has');

  public set = fn((name: string, value: string): void => {
    this.headers[name] = value;
  }).mockName('headers().set');

  public forEach = fn(
    (callbackfn: (value: string, name: string, parent: Headers) => void, thisArg?: any): void => {
      for (const [name, value] of this.entries()) {
        callbackfn.call(thisArg, value, name, this);
      }
    }
  ).mockName('headers().forEach');

  public *entries(): IterableIterator<[string, string]> {
    for (const key of Object.keys(this.headers)) {
      const name = key.toLowerCase();
      // We assert here that this is a string because we got it from the
      // Object.keys() call above.
      const value = this.get(name) as string;

      yield [name, value] as [string, string];
    }
  }

  public *keys(): IterableIterator<string> {
    for (const key of Object.keys(this.headers)) {
      const name = key.toLowerCase();
      yield name;
    }
  }

  public *values(): IterableIterator<string> {
    for (const key of Object.keys(this.headers)) {
      // We assert here that this is a string because we got it from the
      // Object.keys() call above.
      const value = this.get(key) as string;

      yield value;
    }
  }

  public [Symbol.iterator](): IterableIterator<[string, string]> {
    return this.entries();
  }
}

let headerStore: HeadersStore;

export const headers = (): HeadersStore => {
  if (!headerStore) {
    headerStore = new HeadersStore();
  }
  return headerStore;
};

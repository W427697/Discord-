import { fn } from '@storybook/test';

import { HeadersAdapter } from 'next/dist/server/web/spec-extension/adapters/headers';

class HeadersAdapterMock extends HeadersAdapter {
  constructor() {
    super({});
  }

  append = fn(super.append).mockName('next/headers::headers().append');

  delete = fn(super.delete).mockName('next/headers::headers().delete');

  get = fn(super.get).mockName('next/headers::headers().get');

  has = fn(super.has).mockName('next/headers::headers().has');

  set = fn(super.set).mockName('next/headers::headers().set');

  forEach = fn(super.forEach).mockName('next/headers::headers().forEach');

  entries = fn(super.entries).mockName('next/headers::headers().entries');

  keys = fn(super.keys).mockName('next/headers::headers().keys');

  values = fn(super.values).mockName('next/headers::headers().values');
}

let headersAdapterMock: HeadersAdapterMock;

export const headers = () => {
  if (!headersAdapterMock) headersAdapterMock = new HeadersAdapterMock();
  return headersAdapterMock;
};

// This fn is called by ./cookies to restore the headers in the right order
headers.mockRestore = () => {
  headersAdapterMock = new HeadersAdapterMock();
};

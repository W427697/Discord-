import Database from '@kadira/storybook-database';

export default function createDatabase({ url }) {
  const persister = new LocalPersister({ url });
  return new Database({ persister });
}

export class LocalPersister {
  constructor({ url }) {
    this.url = url;
    this.fetch = window.fetch;
  }

  set(collection, item) {
    const body = JSON.stringify({ collection, item });
    return this.fetch(`${this.url}/set`, {method: 'post', body})
      .then(res => res.json())
      .then(res => res.data);
  }

  get(collection, query, options) {
    const { sort, limit } = options;
    const body = JSON.stringify({ collection, query, sort, limit });
    return this.fetch(`${this.url}/get`, {method: 'post', body})
      .then(res => res.json())
      .then(res => res.data);
  }
}

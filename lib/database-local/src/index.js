import Database from '@kadira/storybook-database';
import LocalPersister from './persister';

export default function createDatabase({ url }) {
  const persister = new LocalPersister({ url });
  return new Database({ persister });
}

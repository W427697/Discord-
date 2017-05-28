# Storybook Database

Storybook Channel is the storage service provided for Storybook Addons.

```js
class Database {
  getCollection(name) {}
}

class Collection {
  set(item) {}
  get(query, options) {}
}
```

The channel takes a Persister object as a parameter which will be used to store/retrieve data. The transport object should implement this interface.

```js
class Persister {
  set(collection, item) {}
  get(collection, query, options) {}
}
```

Currently, databases are baked into storybook implementations and therefore this module is not designed to be used directly by addon developers. When developing addons, use the `getDatabase` method exported by `@storybook/addons` module. For this to work, Storybook implementations should use the `setDatabase` method before loading addons.

```js
import addons from '@storybook/addons'
const db = addons.getDatabase()
```

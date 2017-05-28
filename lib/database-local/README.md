# Local Database

> status: discontinued

Local database for Storybook.
This database can be used when developing Storybook on local machine.

```js
import createDatabase from '@storybook/database-local'
const db = createDatabase({ url: 'http://localhost:9001/db' })
```

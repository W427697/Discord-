import { defineProject } from 'vitest/config';
import { sep, posix } from 'path';
// import { fileURLToPath } from 'url';

// const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineProject({
  test: {
    environment: 'node',
    name: __dirname.split(sep).slice(-2).join(posix.sep),
  },
});

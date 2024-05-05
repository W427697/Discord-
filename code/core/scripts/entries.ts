import { defineEntry } from '../../../scripts/prepare/tools';

export const getEntries = (cwd: string) => {
  const define = defineEntry(cwd);

  return [
    //
    define('src/index.ts', ['node', 'browser'], true),
    define('src/test.ts', ['node'], false), // testing a non-dts file

    define('src/node-logger/index.ts', ['node'], true),
    define('src/client-logger/index.ts', ['browser', 'node'], true),

    define('src/core-events/index.ts', ['browser', 'node'], true),
    define('src/manager-errors.ts', ['browser'], true),
    define('src/preview-errors.ts', ['browser', 'node'], true),
    define('src/server-errors.ts', ['node'], true),

    define('src/channels/index.ts', ['browser', 'node'], true),
    define('src/types/index.ts', ['browser', 'node'], true),
    define('src/csf-tools/index.ts', ['node'], true),
    define('src/common/index.ts', ['node'], true),
    define('src/telemetry/index.ts', ['node'], true),
    define('src/preview-api/index.ts', ['browser', 'node'], true),
    define('src/instrumenter/index.ts', ['browser', 'node'], true),
    define('src/router/index.ts', ['browser', 'node'], true, ['react']),
  ];
};

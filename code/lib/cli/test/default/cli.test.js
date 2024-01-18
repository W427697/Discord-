import { describe, it, expect } from 'vitest';

import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

const run = require('../helpers.cjs');

describe('Default behavior', () => {
  it('suggests the closest match to an unknown command', () => {
    const { status, stderr, stdout } = run(['upgraed']);

    // Assertions
    expect(status).toBe(1);
    expect(stderr.toString()).toContain('Invalid command: upgraed.');
    expect(stdout.toString()).toContain('Did you mean upgrade?');
  });
});

import { tmpdir } from 'os';
import { join } from 'path';
import { exists, readJSON, rmSync } from 'fs-extra';
import { readFile, open } from 'node:fs/promises';
import type { NextConfig } from 'next';
import { PHASE_DEVELOPMENT_SERVER } from 'next/constants';
import { buildDevStandalone, withTelemetry } from '@storybook/nextjs-server/core-server';
import { cache } from '@storybook/nextjs-server/core-common';

const logger = console;
const LOCKFILE = join(tmpdir(), 'storybook-nextjs.lock');

[
  'SIGHUP',
  'SIGINT',
  'SIGQUIT',
  'SIGILL',
  'SIGTRAP',
  'SIGABRT',
  'SIGBUS',
  'SIGFPE',
  'SIGUSR1',
  'SIGSEGV',
  'SIGUSR2',
  'SIGTERM',
].forEach((sig) => {
  process.on(sig, () => {
    rmSync(LOCKFILE);
    logger.log('Removed lockfile', sig, LOCKFILE);
  });
});

function addRewrites(
  existing: NextConfig['rewrites'] | undefined,
  ourRewrites: { source: string; destination: string }[]
): NextConfig['rewrites'] {
  if (!existing) return async () => ourRewrites;

  return async () => {
    const existingRewrites = await existing();

    if (Array.isArray(existingRewrites)) return [...existingRewrites, ...ourRewrites];

    return {
      ...existingRewrites,
      fallback: [...existingRewrites.fallback, ...ourRewrites],
    };
  };
}
const isLocked = async () => {
  if (await exists(LOCKFILE)) {
    const pid = parseInt(await readFile(LOCKFILE, 'utf-8'), 10);
    // FIXME: rmSync seems to clear the contents of the file but not actually delete it???
    if (!Number.isNaN(pid)) {
      // logger.log('Lockfile exists for PID', pid, 'current PID', process.pid, LOCKFILE);
      return true;
    }
  }
  return false;
};

const createLockfile = async () => {
  logger.log('Creating lockfile for PID', process.pid, LOCKFILE);
  const fh = await open(LOCKFILE, 'a');
  await fh.write(process.pid.toString());
  await fh.close();
};

const startStorybook = async ({ port, sbPort, previewPath }: WithStorybookOptions) => {
  if (await isLocked()) return;
  await createLockfile();

  const packageJson = await readJSON(join(process.cwd(), 'package.json'));

  const cliOptions = {
    ci: true,
    port: sbPort,
    previewUrl: `http://localhost:${port}/${previewPath}`,
  };

  const options = {
    ...cliOptions,
    configDir: join(process.cwd(), '.storybook'),
    configType: 'DEVELOPMENT',
    ignorePreview: !!cliOptions.previewUrl,
    cache,
    packageJson,
  } as Parameters<typeof buildDevStandalone>[0];

  try {
    withTelemetry(
      'dev',
      {
        cliOptions,
        presetOptions: options as Parameters<typeof withTelemetry>[1]['presetOptions'],
        printError: logger.error,
      },
      () => buildDevStandalone(options)
    );
  } catch (err) {
    logger.error(err);
  }
};

interface WithStorybookOptions {
  port: number;
  sbPort: number;
  managerPath: string;
  previewPath: string;
}

export const withStorybook = ({
  port = 3000,
  sbPort = 34567,
  managerPath = 'storybook',
  // TODO -- how to pass this to codegen if changed?
  previewPath = 'storybookPreview',
}: Partial<WithStorybookOptions> = {}) => {
  return (config: NextConfig = {}) => {
    return async (phase: string, options: any) => {
      if (phase !== PHASE_DEVELOPMENT_SERVER) return config;

      await startStorybook({ port, sbPort, managerPath, previewPath });

      const updated = {
        ...config,
        rewrites: addRewrites(config.rewrites, [
          {
            source: '/logo.svg',
            destination: `http://localhost:${sbPort}/logo.svg`,
          },
          {
            source: `/${managerPath}/:path*`,
            destination: `http://localhost:${sbPort}/:path*`,
          },
          {
            source: '/sb-manager/:path*',
            destination: `http://localhost:${sbPort}/sb-manager/:path*`,
          },
          {
            source: '/sb-common-assets/:path*',
            destination: `http://localhost:${sbPort}/sb-common-assets/:path*`,
          },
          {
            source: '/sb-preview/:path*',
            destination: `http://localhost:${sbPort}/sb-preview/:path*`,
          },
          {
            source: '/sb-addons/:path*',
            destination: `http://localhost:${sbPort}/sb-addons/:path*`,
          },
          {
            source: '/storybook-server-channel',
            destination: `http://localhost:${sbPort}/storybook-server-channel`,
          },
          {
            source: '/index.json',
            destination: `http://localhost:${sbPort}/index.json`,
          },
          {
            source: `/${previewPath}/index.json`,
            destination: `http://localhost:${sbPort}/index.json`,
          },
        ]),
        async headers() {
          return [
            ...(config.headers ? await config.headers() : []),
            {
              source: `/${previewPath}/:path*`,
              headers: [
                {
                  key: 'x-frame-options',
                  value: '',
                },
              ],
            },
          ];
        },
      };
      return updated;
    };
  };
};

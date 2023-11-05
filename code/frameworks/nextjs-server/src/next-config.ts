import type { NextConfig } from 'next';
import { spawn } from 'child_process';

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

export const withStorybook = ({
  port = 3000,
  sbPort = 34567,
  managerPath = 'storybook',
  // TODO -- how to pass this to codegen if changed?
  previewPath = '/storybookPreview',
}) => {
  spawn(
    'yarn',
    [
      'storybook',
      '--preview-url',
      `http://localhost:${port}/${previewPath}`,
      '-p',
      sbPort.toString(),
      '--ci',
    ],
    { stdio: 'inherit' }
  );

  return (config: NextConfig) => ({
    ...config,
    experimental: {
      serverActions: true, // TODO: not needed for next 14, how to disambiguate?
    },
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
  });
};

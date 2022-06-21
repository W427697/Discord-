import express from 'express';

import type { CoreConfig, Options, StorybookConfig } from '@storybook/core-common';
import { normalizeStories, logConfig } from '@storybook/core-common';

import { telemetry } from '@storybook/telemetry';
import { getMiddleware } from './utils/middleware';
import { getServerAddresses } from './utils/server-address';
import { serverInit } from './utils/server-init';
import { useStatics } from './utils/server-statics';
import { useStoriesJson } from './utils/stories-json';
import { useStorybookMetadata } from './utils/metadata';
import { getServerChannel } from './utils/get-server-channel';

import { openInBrowser } from './utils/open-in-browser';
import { getBuilders } from './utils/get-builders';
import { StoryIndexGenerator } from './utils/StoryIndexGenerator';

export const DEBOUNCE = 100;

export async function storybookDevServer(options: Options) {
  const startTime = process.hrtime();

  const app = await serverInit(options);
  // await app.register(import('@fastify/express'));
  const { server } = app;
  // const router = express.Router();
  const serverChannel = getServerChannel(server);

  const features = await options.presets.apply<StorybookConfig['features']>('features');
  const core = await options.presets.apply<CoreConfig>('core');
  // try get index generator, if failed, send telemetry without storyCount, then rethrow the error
  let initializedStoryIndexGenerator: Promise<StoryIndexGenerator> = Promise.resolve(undefined);
  if (features?.buildStoriesJson || features?.storyStoreV7) {
    try {
      const workingDir = process.cwd();
      const directories = {
        configDir: options.configDir,
        workingDir,
      };
      const normalizedStories = normalizeStories(
        await options.presets.apply('stories'),
        directories
      );
      const storyIndexers = await options.presets.apply('storyIndexers', []);

      const generator = new StoryIndexGenerator(normalizedStories, {
        ...directories,
        storyIndexers,
        workingDir,
        storiesV2Compatibility: !features?.breakingChangesV7 && !features?.storyStoreV7,
        storyStoreV7: features?.storyStoreV7,
      });

      initializedStoryIndexGenerator = generator.initialize().then(() => generator);
      useStoriesJson({
        router: app,
        initializedStoryIndexGenerator,
        normalizedStories,
        serverChannel,
        workingDir,
      });
    } catch (err) {
      if (!core?.disableTelemetry) {
        telemetry('start');
      }
      throw err;
    }
  }

  if (!core?.disableTelemetry) {
    initializedStoryIndexGenerator.then(async (generator) => {
      if (!generator) {
        return;
      }

      const storyIndex = await generator.getIndex();
      const payload = storyIndex
        ? {
            storyIndex: {
              storyCount: Object.keys(storyIndex.stories).length,
              version: storyIndex.v,
            },
          }
        : undefined;
      telemetry('start', payload, { configDir: options.configDir });
    });
  }

  if (!core?.disableProjectJson) {
    useStorybookMetadata(app, options.configDir);
  }

  await app.register(import('@fastify/compress'), { global: true });

  if (typeof options.extendServer === 'function') {
    options.extendServer(server);
  }

  // app.addHook('preHandler', (req, reply, done) => {
  //   reply.header('X-custom', 'value');
  //   done();
  // });

  app.addHook('onRequest', (req, res, done) => {
    res.header('X-custom', 'value2');
    done();
  });

  // These headers are required to enable SharedArrayBuffer
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer
  await app.register(require('@fastify/cors'), {
    origin: '*',
    allowedHeaders: 'Origin,X-Requested-With,Content-Type,Accept',
  });

  // if (core?.crossOriginIsolated) {
  //   app.use((req, res, next) => {
  //     // These headers are required to enable SharedArrayBuffer
  //     // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer
  //     res.header('Cross-Origin-Opener-Policy', 'same-origin');
  //     res.header('Cross-Origin-Embedder-Policy', 'require-corp');
  //     next();
  //   });
  // }

  // User's own static files
  await useStatics(app, options);

  getMiddleware(options.configDir)(app);
  // app.use(router);

  const { port, host } = options;
  const proto = options.https ? 'https' : 'http';
  const { address, networkAddress } = getServerAddresses(port, host, proto);

  const [previewBuilder, managerBuilder] = await getBuilders(options);

  if (options.debugWebpack) {
    logConfig('Preview webpack config', await previewBuilder.getConfig(options));
    logConfig('Manager webpack config', await managerBuilder.getConfig(options));
  }

  const preview = options.ignorePreview
    ? Promise.resolve()
    : previewBuilder.start({
        startTime,
        options,
        router: app,
        server,
      });

  const manager = managerBuilder.start({
    startTime,
    options,
    router: app,
    server,
  });

  const [previewResult, managerResult] = await Promise.all([
    preview.catch(async (err) => {
      await managerBuilder?.bail();
      throw err;
    }),
    manager
      // TODO #13083 Restore this when compiling the preview is fast enough
      // .then((result) => {
      //   if (!options.ci && !options.smokeTest) openInBrowser(address);
      //   return result;
      // })
      .catch(async (err) => {
        await previewBuilder?.bail();
        throw err;
      }),
  ]);

  await new Promise<void>((resolve, reject) => {
    app.listen({ port, host }, (error) => {
      return error ? reject(error) : resolve();
    });
  });

  // TODO #13083 Remove this when compiling the preview is fast enough
  if (!options.ci && !options.smokeTest && options.open) {
    openInBrowser(host ? networkAddress : address);
  }

  return { previewResult, managerResult, address, networkAddress };
}

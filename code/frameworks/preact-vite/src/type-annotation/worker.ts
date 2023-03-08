import { parentPort, workerData } from 'node:worker_threads';
import type { TypeAnalyzer } from '@previewjs/type-analyzer';
import { createTypeAnalyzer } from '@previewjs/type-analyzer';
import preactFrameworkPlugin from '@previewjs/plugin-preact';
import type { Reader } from '@previewjs/vfs';
import { createFileSystemReader } from '@previewjs/vfs';
import type { FrameworkPlugin } from '@previewjs/core';
import { setupFrameworkPlugin } from '@previewjs/core';
import type { Asynced, RequestMessage, ResponseError, ResponseSuccess } from './interfaces';
import type { PluginOptions } from './index';

const options: Pick<PluginOptions, 'rootDir'> = workerData.options ?? {};

const analyzer = {
  async analyze(fileName: string) {
    const components = await frameworkPlugin.detectComponents(reader, typeAnalyzer, [fileName]);
    const results: { name: string; args: any }[] = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const component of components) {
      if (component.info.kind === 'component') {
        // eslint-disable-next-line no-await-in-loop
        results.push({ name: component.name, args: (await component.info.analyze())?.propsType });
      } else {
        results.push({
          name: component.name,
          // eslint-disable-next-line no-await-in-loop
          args: (await component.info.associatedComponent?.analyze())?.propsType,
        });
      }
    }
    return results;
  },
};

export type WorkerAPI = Asynced<typeof analyzer>;

let typeAnalyzer: TypeAnalyzer;
let frameworkPlugin: FrameworkPlugin;
let reader: Reader;

const init = async () => {
  if (!reader) {
    reader = createFileSystemReader();
  }
  if (!typeAnalyzer) {
    typeAnalyzer = createTypeAnalyzer({
      rootDirPath: options.rootDir,
      reader,
    });
  }
  if (!frameworkPlugin) {
    frameworkPlugin = await setupFrameworkPlugin({
      rootDirPath: options.rootDir,
      frameworkPluginFactories: [preactFrameworkPlugin],
    });
  }
};

const replySuccess = <T>(id: number, result: T) => {
  const response: ResponseSuccess<T> = { id, kind: 'success', result };
  parentPort.postMessage(response);
};

const replyError = <T>(id: number, error: T) => {
  const response: ResponseError<T> = { id, kind: 'error', error };
  parentPort.postMessage(response);
};

const routeMessage = async (message: RequestMessage) => {
  try {
    await init();
    if (message.method in analyzer) {
      replySuccess(
        message.id,
        await analyzer[message.method as keyof typeof analyzer](message.args as any)
      );
    } else {
      replyError(message.id, `Unknown method: ${message.method}`);
    }
  } catch (ex) {
    replyError(message.id, ex.toString());
  }
};

parentPort.addListener('message', routeMessage);

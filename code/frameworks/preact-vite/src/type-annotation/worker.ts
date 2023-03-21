import { parentPort, workerData } from 'node:worker_threads';
import type { Asynced, RequestMessage, ResponseError, ResponseSuccess } from './interfaces';
import { create as createAnalyzer } from './analyzer';

const options: { rootDir: string } = workerData ?? {};

const { analyzer, init } = createAnalyzer(options);

export type WorkerAPI = Asynced<typeof analyzer>;

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

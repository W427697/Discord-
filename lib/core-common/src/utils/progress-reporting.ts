import type { FastifyInstance } from 'fastify';
import { printDuration } from './print-duration';

export const useProgressReporting = async (
  router: FastifyInstance,
  startTime: [number, number],
  options: any
): Promise<{ handler: any; modulesCount: number }> => {
  let value = 0;
  let totalModules: number;
  let reportProgress: (progress?: { value?: number; message: string; modules?: any }) => void =
    () => {};

  router.get('/progress', (request, reply) => {
    let closed = false;
    const close = () => {
      closed = true;
      reply.raw.end();
    };
    reply.raw.on('close', close);

    if (closed || reply.raw.writableEnded) return;
    reply.header('Cache-Control', 'no-cache');
    reply.header('Content-Type', 'text/event-stream');
    reply.header('Connection', 'keep-alive');
    reply.raw.flushHeaders();

    reportProgress = (progress: any) => {
      if (closed || reply.raw.writableEnded) return;
      reply.raw.write(`data: ${JSON.stringify(progress)}\n\n`);
      reply.raw.flushHeaders();
      if (progress.value === 1) close();
    };
  });

  const handler = (newValue: number, message: string, arg3: any) => {
    value = Math.max(newValue, value); // never go backwards
    const progress = { value, message: message.charAt(0).toUpperCase() + message.slice(1) };
    if (message === 'building') {
      // arg3 undefined in webpack5
      const counts = (arg3 && arg3.match(/(\d+)\/(\d+)/)) || [];
      const complete = parseInt(counts[1], 10);
      const total = parseInt(counts[2], 10);
      if (!Number.isNaN(complete) && !Number.isNaN(total)) {
        (progress as any).modules = { complete, total };
        totalModules = total;
      }
    }

    if (value === 1) {
      if (options.cache) {
        options.cache.set('modulesCount', totalModules);
      }

      if (!progress.message) {
        progress.message = `Completed in ${printDuration(startTime)}.`;
      }
    }
    reportProgress(progress);
  };

  const modulesCount = (await options.cache?.get('modulesCount').catch(() => {})) || 1000;
  return { handler, modulesCount };
};

import fs from 'fs-extra';
import type { FastifyInstance } from 'fastify';
import { getStorybookMetadata } from '@storybook/telemetry';

export async function extractStorybookMetadata(outputFile: string, configDir: string) {
  const storybookMetadata = await getStorybookMetadata(configDir);

  await fs.writeJson(outputFile, storybookMetadata);
}

export function useStorybookMetadata(router: FastifyInstance, configDir?: string) {
  router.get('/project.json', async (request, reply) => {
    const storybookMetadata = await getStorybookMetadata(configDir);
    reply.header('Content-Type', 'application/json');
    reply.send(JSON.stringify(storybookMetadata));
  });
}

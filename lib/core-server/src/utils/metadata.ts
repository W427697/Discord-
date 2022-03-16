import fs from 'fs-extra';
import { Request, Response, Router } from 'express';
import { getStorybookMetadata } from '@storybook/telemetry';

export async function extractStorybookMetadata(outputFile: string, configDir: string) {
  const storybookMetadata = await getStorybookMetadata(configDir);

  await fs.writeJson(outputFile, storybookMetadata);
}

export async function useStorybookMetadata(router: Router) {
  router.use('/project.json', async (req: Request, res: Response) => {
    const storybookMetadata = await getStorybookMetadata();
    res.header('Content-Type', 'application/json');
    res.send(JSON.stringify(storybookMetadata));
  });
}

import fs from 'fs-extra';
import { Request, Response, Router } from 'express';
import { getStorybookMetadata } from '@storybook/telemetry';

export async function extractStorybookMetadata(outputFile: string) {
  const storybookMetadata = await getStorybookMetadata();

  await fs.writeJson(outputFile, storybookMetadata);
}

export async function useStorybookMetadata(router: Router) {
  router.use('/metadata.json', async (req: Request, res: Response) => {
    const metadata = await getStorybookMetadata();
    res.header('Content-Type', 'application/json');
    res.send(JSON.stringify(metadata));
  });
}

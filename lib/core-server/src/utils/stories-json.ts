import { Router, Request, Response } from 'express';
import fs from 'fs-extra';
import { StoryIndex } from '@storybook/store';
import { StoryIndexGenerator } from './StoryIndexGenerator';

export async function extractStoriesJson(outputFile: string, storiesIndex: StoryIndex) {
  await fs.writeJson(outputFile, storiesIndex);
}

export async function useStoriesJson(router: Router, storyIndexGenerator: StoryIndexGenerator) {
  router.use('/stories.json', async (req: Request, res: Response) => {
    try {
      const index = await storyIndexGenerator.getIndex();
      res.header('Content-Type', 'application/json');
      res.send(JSON.stringify(index));
    } catch (err) {
      res.status(500);
      res.send(err.message);
    }
  });
}

import fs from 'fs-extra';
import { getConfigFilePath } from './paths';

export const write = async (name: string, content: string) => {
  await fs.outputFile(name, content);
};

export const cached = async (name: string, create: () => Promise<unknown>) => {
  // const filePath = getConfigFilePath(name);

  // await fs.readFile(filePath, 'utf8').catch(create);

  // temp for debugging
  await create();
};

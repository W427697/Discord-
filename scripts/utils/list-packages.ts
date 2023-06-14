import { exec } from 'child_process';
import { CODE_DIRECTORY } from './constants';

export interface Package {
  name: string;
  version: string;
  private: boolean;
  location: string;
}

export const listOfPackages = (): Promise<Package[]> => {
  const lerna = require.resolve('lerna/cli');
  return new Promise((res, rej) => {
    const command = `node ${lerna} list --json`;
    exec(command, { cwd: CODE_DIRECTORY }, (e, result) => {
      if (e) {
        rej(e);
      } else {
        const data = JSON.parse(result.toString().trim());
        res(data);
      }
    });
  });
};

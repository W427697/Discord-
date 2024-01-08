import prompts from 'prompts';
import packageVersions from '../versions';

export const detectStorybookVersionFromNodeArgs = async (args: string[]) => {
  const version = args.reduce<undefined | null | string>((acc, arg) => {
    if (arg.startsWith('storybook@') || arg.startsWith('sb@')) {
      return arg.split('@')[1];
    }
    if (arg === 'storybook' || arg === 'sb') {
      return null;
    }
    return acc;
  }, undefined);

  if (typeof version === 'string') {
    return version;
  }

  if (typeof version === 'undefined') {
    return packageVersions.storybook;
  }

  const { runLatest } = await prompts({
    type: 'confirm',
    initial: false,
    name: 'runLatest',
    message: `You ran the storybook CLI without specifying a version, do you want to run the latest version?`,
  });

  if (runLatest) {
    return undefined;
  }

  throw new Error('user cancelled');
};

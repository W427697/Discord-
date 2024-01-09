export const validateCLIVersioningFromProcessArgs = (args: string[]) => {
  const versioned = args.reduce<boolean>((acc, arg) => {
    if (
      arg.startsWith('storybook@') ||
      arg.startsWith('@storybook/cli@') ||
      arg.startsWith('sb@')
    ) {
      return true;
    }
    return acc;
  }, false);

  const command = args.reduce<boolean>((acc, arg) => {
    if (arg === 'storybook' || arg === '@storybook/cli' || arg === 'sb') {
      return true;
    }
    return acc;
  }, false);

  if (versioned) {
    return true;
  }

  if (command) {
    return false;
  }

  // when we cannot detect either, we assume it's a direct invocation of the CLI
  return true;
};

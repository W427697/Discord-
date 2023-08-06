import { LOCAL_REGISTRY_URL } from './constants';
import { exec } from './exec';

type Options = {
  cwd: string;
  dryRun: boolean;
  debug: boolean;
};

export const configurePnpmForVerdaccio = async ({ cwd, dryRun, debug }: Options) => {
  exec(
    [`echo "registry=${LOCAL_REGISTRY_URL}\nprefer-frozen-lockfile=false" >> .npmrc`],
    { cwd },
    {
      dryRun,
      debug,
      startMessage: `🎛 Configuring PNPM`,
      errorMessage: `🚨 Configuring PNPM failed`,
    }
  );
};

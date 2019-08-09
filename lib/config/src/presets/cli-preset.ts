import { CliOptions } from '../types/cli';
import { Preset } from '../types/presets';

export const createCLIPreset = (cliOptions: CliOptions): Preset => {
  // TODO:
  // implement smokeTest, noDll, debugWebpack

  const { port, staticDir, host, sslCa, sslCert, sslKey, https, outputDir, logLevel } = cliOptions;
  return {
    server: ({ static: existingStatic = [], ...base }) =>
      Object.assign(
        {},
        base,
        host ? { host } : {},
        port ? { port } : {},
        staticDir && staticDir.length
          ? { static: existingStatic.concat(staticDir.map(i => ({ '/': i }))) }
          : {},
        https ? { ssl: { ca: sslCa, key: sslKey, cert: sslCert } } : {}
      ),
    output: outputDir ? { location: outputDir } : {},
    logLevel: base => logLevel || base,
  };
};

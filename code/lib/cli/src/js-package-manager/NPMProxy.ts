import sort from 'semver/functions/sort';
import { platform } from 'os';
import { JsPackageManager } from './JsPackageManager';
import type { PackageJson } from './PackageJson';
import type { InstallationMetadata, PackageMetadata } from './types';
import { createLogStream } from '../utils';
import { paddedLog } from '../helpers';

type NpmDependency = {
  version: string;
  resolved?: string;
  overridden?: boolean;
  dependencies?: NpmDependencies;
};

type NpmDependencies = {
  [key: string]: NpmDependency;
};

export type NpmListOutput = {
  dependencies: NpmDependencies;
};

export class NPMProxy extends JsPackageManager {
  readonly type = 'npm';

  installArgs: string[] | undefined;

  async initPackageJson() {
    await this.executeCommand({ command: 'npm', args: ['init', '-y'] });
  }

  getRunStorybookCommand(): string {
    return 'npm run storybook';
  }

  getRunCommand(command: string): string {
    return `npm run ${command}`;
  }

  async getNpmVersion(): Promise<string> {
    return this.executeCommand({ command: 'npm', args: ['--version'] });
  }

  getInstallArgs(): string[] {
    if (!this.installArgs) {
      this.installArgs = [];
    }
    return this.installArgs;
  }

  public runPackageCommandSync(command: string, args: string[], cwd?: string): string {
    return this.executeCommandSync({
      command: 'npm',
      args: ['exec', '--', command, ...args],
      cwd,
    });
  }

  public async runPackageCommand(command: string, args: string[], cwd?: string): Promise<string> {
    return this.executeCommand({
      command: 'npm',
      args: ['exec', '--', command, ...args],
      cwd,
    });
  }

  public async findInstallations() {
    const pipeToNull = platform() === 'win32' ? '2>NUL' : '2>/dev/null';
    const commandResult = await this.executeCommand({
      command: 'npm',
      args: ['ls', '--json', '--depth=99', pipeToNull],
      // ignore errors, because npm ls will exit with code 1 if there are e.g. unmet peer dependencies
      ignoreError: true,
    });

    try {
      const parsedOutput = JSON.parse(commandResult);
      return this.mapDependencies(parsedOutput);
    } catch (e) {
      return undefined;
    }
  }

  protected getResolutions(packageJson: PackageJson, versions: Record<string, string>) {
    return {
      overrides: {
        ...packageJson.overrides,
        ...versions,
      },
    };
  }

  protected async runInstall() {
    return this.runAddDeps();
  }

  protected async runAddDeps(dependencies: string[] = [], installAsDevDependencies = false) {
    const { logStream, readLogFile, clearLogFile, moveLogFile, removeLogFile } =
      await createLogStream('init-storybook.log');

    let args = [...dependencies];

    if (installAsDevDependencies) {
      args = ['-D', ...args];
    }

    let tries = 0;
    const install = async () => {
      // if this fails due to connection issues we try again 2 times
      // if it ends up failing another way or after trying 3 times we tell the user to go read the logfile
      if (tries >= 3) {
        await moveLogFile();
        throw new Error(
          "We tried to install Storybook's dependencies but your connection caused issues. Please check the logfile generated at ./init-install.log for troubleshooting and try again."
        );
      }

      await clearLogFile();
      tries += 1;

      try {
        await this.executeCommand({
          command: 'npm',
          args: ['install', ...this.getInstallArgs(), ...args],
          stdio: ['ignore', logStream, logStream],
        });
      } catch (err) {
        const stdout = await readLogFile();

        if (stdout.includes('ECONNRESET')) {
          paddedLog('Ran into connection issues while installing dependencies, retrying...');
          await install();
          return;
        }

        await moveLogFile();

        throw new Error(
          'Something went wrong while installing Storybook dependencies. Please check the logfile generated at ./init-install.log for troubleshooting and try again.'
        );
      }
    };

    await install();
    await removeLogFile();
  }

  protected async runRemoveDeps(dependencies: string[]) {
    const args = [...dependencies];

    await this.executeCommand({
      command: 'npm',
      args: ['uninstall', ...this.getInstallArgs(), ...args],
      stdio: 'inherit',
    });
  }

  protected async runGetVersions<T extends boolean>(
    packageName: string,
    fetchAllVersions: T
  ): Promise<T extends true ? string[] : string> {
    const args = [fetchAllVersions ? 'versions' : 'version', '--json'];

    const commandResult = await this.executeCommand({
      command: 'npm',
      args: ['info', packageName, ...args],
    });

    try {
      const parsedOutput = JSON.parse(commandResult);

      if (parsedOutput.error) {
        // FIXME: improve error handling
        throw new Error(parsedOutput.error.summary);
      } else {
        return parsedOutput;
      }
    } catch (e) {
      throw new Error(`Unable to find versions of ${packageName} using npm`);
    }
  }

  protected mapDependencies(input: NpmListOutput): InstallationMetadata {
    const acc: Record<string, PackageMetadata[]> = {};
    const existingVersions: Record<string, string[]> = {};
    const duplicatedDependencies: Record<string, string[]> = {};

    const recurse = ([name, packageInfo]: [string, NpmDependency]): void => {
      if (!name || !name.includes('storybook')) return;

      const value = {
        version: packageInfo.version,
        location: '',
      };

      if (!existingVersions[name]?.includes(value.version)) {
        if (acc[name]) {
          acc[name].push(value);
        } else {
          acc[name] = [value];
        }
        existingVersions[name] = sort([...(existingVersions[name] || []), value.version]);

        if (existingVersions[name].length > 1) {
          duplicatedDependencies[name] = existingVersions[name];
        }
      }

      if (packageInfo.dependencies) {
        Object.entries(packageInfo.dependencies).forEach(recurse);
      }
    };

    Object.entries(input.dependencies).forEach(recurse);

    return {
      dependencies: acc,
      duplicatedDependencies,
      infoCommand: 'npm ls --depth=1',
    };
  }
}

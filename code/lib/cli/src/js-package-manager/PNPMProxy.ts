import { pathExistsSync } from 'fs-extra';
import dedent from 'ts-dedent';
import { JsPackageManager } from './JsPackageManager';
import type { PackageJson } from './PackageJson';
import type { InstallationMetadata, PackageMetadata } from './types';
import { createLogStream } from '../utils';

type PnpmDependency = {
  from: string;
  version: string;
  resolved: string;
  dependencies?: PnpmDependencies;
};

type PnpmDependencies = {
  [key: string]: PnpmDependency;
};

type PnpmListItem = {
  dependencies: PnpmDependencies;
  peerDependencies: PnpmDependencies;
  devDependencies: PnpmDependencies;
};

export type PnpmListOutput = PnpmListItem[];

const PNPM_ERROR_REGEX = /(ELIFECYCLE|ERR_PNPM_[A-Z_]+)\s+(.*)/i;
const PNPM_ERROR_CODES = {
  ELIFECYCLE: 'Lifecycle error',
  ERR_PNPM_BAD_TARBALL_SIZE: 'Bad tarball size error',
  ERR_PNPM_DEDUPE_CHECK_ISSUES: 'Dedupe check issues error',
  ERR_PNPM_FETCH_401: 'Fetch 401 error',
  ERR_PNPM_FETCH_403: 'Fetch 403 error',
  ERR_PNPM_LOCKFILE_BREAKING_CHANGE: 'Lockfile breaking change error',
  ERR_PNPM_MODIFIED_DEPENDENCY: 'Modified dependency error',
  ERR_PNPM_MODULES_BREAKING_CHANGE: 'Modules breaking change error',
  ERR_PNPM_NO_MATCHING_VERSION: 'No matching version error',
  ERR_PNPM_PEER_DEP_ISSUES: 'Peer dependency issues error',
  ERR_PNPM_RECURSIVE_FAIL: 'Recursive command failed error',
  ERR_PNPM_RECURSIVE_RUN_NO_SCRIPT: 'Recursive run no script error',
  ERR_PNPM_STORE_BREAKING_CHANGE: 'Store breaking change error',
  ERR_PNPM_UNEXPECTED_STORE: 'Unexpected store error',
  ERR_PNPM_UNEXPECTED_VIRTUAL_STORE: 'Unexpected virtual store error',
  ERR_PNPM_UNSUPPORTED_ENGINE: 'Unsupported engine error',
};

export class PNPMProxy extends JsPackageManager {
  readonly type = 'pnpm';

  installArgs: string[] | undefined;

  detectWorkspaceRoot() {
    const CWD = process.cwd();

    const pnpmWorkspaceYaml = `${CWD}/pnpm-workspace.yaml`;
    return pathExistsSync(pnpmWorkspaceYaml);
  }

  async initPackageJson() {
    await this.executeCommand({
      command: 'pnpm',
      args: ['init', '-y'],
    });
  }

  getRunStorybookCommand(): string {
    return 'pnpm run storybook';
  }

  getRunCommand(command: string): string {
    return `pnpm run ${command}`;
  }

  async getPnpmVersion(): Promise<string> {
    return this.executeCommand({
      command: 'pnpm',
      args: ['--version'],
    });
  }

  getInstallArgs(): string[] {
    if (!this.installArgs) {
      this.installArgs = [];

      if (this.detectWorkspaceRoot()) {
        this.installArgs.push('-w');
      }
    }
    return this.installArgs;
  }

  public runPackageCommandSync(
    command: string,
    args: string[],
    cwd?: string,
    stdio?: 'pipe' | 'inherit'
  ): string {
    return this.executeCommandSync({
      command: 'pnpm',
      args: ['exec', command, ...args],
      cwd,
      stdio,
    });
  }

  async runPackageCommand(command: string, args: string[], cwd?: string): Promise<string> {
    return this.executeCommand({
      command: 'pnpm',
      args: ['exec', command, ...args],
      cwd,
    });
  }

  public async findInstallations(pattern: string[]) {
    const commandResult = await this.executeCommand({
      command: 'pnpm',
      args: ['list', pattern.map((p) => `"${p}"`).join(' '), '--json', '--depth=99'],
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
    await this.executeCommand({
      command: 'pnpm',
      args: ['install', ...this.getInstallArgs()],
      stdio: 'inherit',
    });
  }

  protected async runAddDeps(dependencies: string[], installAsDevDependencies: boolean) {
    let args = [...dependencies];

    if (installAsDevDependencies) {
      args = ['-D', ...args];
    }
    const { logStream, readLogFile, moveLogFile, removeLogFile } = await createLogStream(
      'init-storybook.log'
    );

    try {
      await this.executeCommand({
        command: 'pnpm',
        args: ['add', ...args, ...this.getInstallArgs()],
        stdio: ['ignore', logStream, logStream],
      });
    } catch (err) {
      const stdout = await readLogFile();

      const errorMessage = this.parseErrorFromLogs(stdout);

      await moveLogFile();

      throw new Error(
        dedent`${errorMessage}
        
        Please check the logfile generated at ./init-install.log for troubleshooting and try again.`
      );
    }

    await removeLogFile();
  }

  protected async runRemoveDeps(dependencies: string[]) {
    const args = [...dependencies];

    await this.executeCommand({
      command: 'pnpm',
      args: ['remove', ...args, ...this.getInstallArgs()],
      stdio: 'inherit',
    });
  }

  protected async runGetVersions<T extends boolean>(
    packageName: string,
    fetchAllVersions: T
  ): Promise<T extends true ? string[] : string> {
    const args = [fetchAllVersions ? 'versions' : 'version', '--json'];

    const commandResult = await this.executeCommand({
      command: 'pnpm',
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
      throw new Error(`Unable to find versions of ${packageName} using pnpm`);
    }
  }

  protected mapDependencies(input: PnpmListOutput): InstallationMetadata {
    const acc: Record<string, PackageMetadata[]> = {};
    const existingVersions: Record<string, string[]> = {};
    const duplicatedDependencies: Record<string, string[]> = {};
    const items: PnpmDependencies = input.reduce((curr, item) => {
      const { devDependencies, dependencies, peerDependencies } = item;
      const allDependencies = { ...devDependencies, ...dependencies, ...peerDependencies };
      return Object.assign(curr, allDependencies);
    }, {} as PnpmDependencies);

    const recurse = ([name, packageInfo]: [string, PnpmDependency]): void => {
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
        existingVersions[name] = [...(existingVersions[name] || []), value.version];

        if (existingVersions[name].length > 1) {
          duplicatedDependencies[name] = existingVersions[name];
        }
      }

      if (packageInfo.dependencies) {
        Object.entries(packageInfo.dependencies).forEach(recurse);
      }
    };
    Object.entries(items).forEach(recurse);

    return {
      dependencies: acc,
      duplicatedDependencies,
      infoCommand: 'pnpm list --depth=1',
    };
  }

  public parseErrorFromLogs(logs: string): string {
    const match = logs.match(PNPM_ERROR_REGEX);
    let errorCode;
    if (match) {
      errorCode = match[1] as keyof typeof PNPM_ERROR_CODES;
      const errorMessage = match[2];
      const errorType = PNPM_ERROR_CODES[errorCode];
      if (errorType && errorMessage) {
        return `${errorCode}: ${errorMessage}`.trim();
      }
    }
    return `Unknown PNPM error${errorCode ? `: ${errorCode}` : ''}`;
  }
}

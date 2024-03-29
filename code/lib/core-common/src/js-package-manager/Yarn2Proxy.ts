import dedent from 'ts-dedent';
import { sync as findUpSync, sync as syncFindUp } from 'find-up';
import { existsSync, readFileSync } from 'fs';
import path from 'path';
import { PosixFS, VirtualFS, ZipOpenFS } from '@yarnpkg/fslib';
import { getLibzipSync } from '@yarnpkg/libzip';
import { createLogStream } from '../utils/cli';
import { JsPackageManager } from './JsPackageManager';
import type { PackageJson } from './PackageJson';
import type { InstallationMetadata, PackageMetadata } from './types';
import { parsePackageData } from './util';

const CRITICAL_YARN2_ERROR_CODES = {
  YN0001: 'EXCEPTION',
  YN0009: 'BUILD_FAILED',
  YN0010: 'RESOLVER_NOT_FOUND',
  YN0011: 'FETCHER_NOT_FOUND',
  YN0012: 'LINKER_NOT_FOUND',
  YN0014: 'YARN_IMPORT_FAILED',
  YN0015: 'REMOTE_INVALID',
  YN0016: 'REMOTE_NOT_FOUND',
  YN0020: 'MISSING_LOCKFILE_ENTRY',
  YN0021: 'WORKSPACE_NOT_FOUND',
  YN0028: 'FROZEN_LOCKFILE_EXCEPTION',
  YN0030: 'FETCH_FAILED',
  YN0046: 'AUTOMERGE_FAILED_TO_PARSE',
  YN0062: 'INCOMPATIBLE_OS',
  YN0063: 'INCOMPATIBLE_CPU',
  YN0071: 'NM_CANT_INSTALL_EXTERNAL_SOFT_LINK',
  YN0072: 'NM_PRESERVE_SYMLINKS_REQUIRED',
  YN0075: 'PROLOG_INSTANTIATION_ERROR',
  YN0076: 'INCOMPATIBLE_ARCHITECTURE',
  YN0078: 'RESOLUTION_MISMATCH',
  YN0081: 'NETWORK_UNSAFE_HTTP',
  YN0082: 'RESOLUTION_FAILED',
  YN0083: 'AUTOMERGE_GIT_ERROR',
};

// This encompasses both yarn 2 and yarn 3
export class Yarn2Proxy extends JsPackageManager {
  readonly type = 'yarn2';

  installArgs: string[] | undefined;

  getInstallArgs(): string[] {
    if (!this.installArgs) {
      this.installArgs = [];
    }
    return this.installArgs;
  }

  async initPackageJson() {
    await this.executeCommand({ command: 'yarn', args: ['init'] });
  }

  getRunStorybookCommand(): string {
    return 'yarn storybook';
  }

  getRunCommand(command: string): string {
    return `yarn ${command}`;
  }

  public runPackageCommandSync(
    command: string,
    args: string[],
    cwd?: string,
    stdio?: 'pipe' | 'inherit'
  ) {
    return this.executeCommandSync({ command: 'yarn', args: [command, ...args], cwd, stdio });
  }

  async runPackageCommand(command: string, args: string[], cwd?: string) {
    return this.executeCommand({ command: 'yarn', args: [command, ...args], cwd });
  }

  public async findInstallations(pattern: string[]) {
    const commandResult = await this.executeCommand({
      command: 'yarn',
      args: ['info', '--name-only', '--recursive', ...pattern],
      env: {
        FORCE_COLOR: 'false',
      },
    });

    try {
      return this.mapDependencies(commandResult, pattern);
    } catch (e) {
      return undefined;
    }
  }

  async getPackageJSON(packageName: string, basePath = this.cwd): Promise<PackageJson | null> {
    const pnpapiPath = findUpSync(['.pnp.js', '.pnp.cjs'], { cwd: basePath });

    if (pnpapiPath) {
      try {
        const pnpApi = require(pnpapiPath);

        const resolvedPath = await pnpApi.resolveToUnqualified(packageName, basePath, {
          considerBuiltins: false,
        });

        const pkgLocator = pnpApi.findPackageLocator(resolvedPath);
        const pkg = pnpApi.getPackageInformation(pkgLocator);

        const zipOpenFs = new ZipOpenFS({
          libzip: getLibzipSync(),
        });

        const virtualFs = new VirtualFS({ baseFs: zipOpenFs });
        const crossFs = new PosixFS(virtualFs);

        const virtualPath = path.join(pkg.packageLocation, 'package.json');

        return crossFs.readJsonSync(virtualPath);
      } catch (error: any) {
        if (error.code !== 'MODULE_NOT_FOUND') {
          console.error('Error while fetching package version in Yarn PnP mode:', error);
        }
        return null;
      }
    }

    const packageJsonPath = await syncFindUp(
      (dir) => {
        const possiblePath = path.join(dir, 'node_modules', packageName, 'package.json');
        return existsSync(possiblePath) ? possiblePath : undefined;
      },
      { cwd: basePath }
    );

    if (!packageJsonPath) {
      return null;
    }

    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
    return packageJson;
  }

  protected getResolutions(packageJson: PackageJson, versions: Record<string, string>) {
    return {
      resolutions: {
        ...packageJson.resolutions,
        ...versions,
      },
    };
  }

  protected async runInstall() {
    await this.executeCommand({
      command: 'yarn',
      args: ['install', ...this.getInstallArgs()],
      stdio: 'inherit',
    });
  }

  protected async runAddDeps(dependencies: string[], installAsDevDependencies: boolean) {
    let args = [...dependencies];

    if (installAsDevDependencies) {
      args = ['-D', ...args];
    }

    const { logStream, readLogFile, moveLogFile, removeLogFile } = await createLogStream();

    try {
      await this.executeCommand({
        command: 'yarn',
        args: ['add', ...this.getInstallArgs(), ...args],
        stdio: process.env.CI ? 'inherit' : ['ignore', logStream, logStream],
      });
    } catch (err) {
      const stdout = await readLogFile();

      const errorMessage = this.parseErrorFromLogs(stdout);

      await moveLogFile();

      throw new Error(
        dedent`${errorMessage}
        
        Please check the logfile generated at ./storybook.log for troubleshooting and try again.`
      );
    }

    await removeLogFile();
  }

  protected async runRemoveDeps(dependencies: string[]) {
    const args = [...dependencies];

    await this.executeCommand({
      command: 'yarn',
      args: ['remove', ...this.getInstallArgs(), ...args],
      stdio: 'inherit',
    });
  }

  protected async runGetVersions<T extends boolean>(
    packageName: string,
    fetchAllVersions: T
  ): Promise<T extends true ? string[] : string> {
    const field = fetchAllVersions ? 'versions' : 'version';
    const args = ['--fields', field, '--json'];

    const commandResult = await this.executeCommand({
      command: 'yarn',
      args: ['npm', 'info', packageName, ...args],
    });

    try {
      const parsedOutput = JSON.parse(commandResult);
      return parsedOutput[field];
    } catch (e) {
      throw new Error(`Unable to find versions of ${packageName} using yarn 2`);
    }
  }

  protected mapDependencies(input: string, pattern: string[]): InstallationMetadata {
    const lines = input.split('\n');
    const acc: Record<string, PackageMetadata[]> = {};
    const existingVersions: Record<string, string[]> = {};
    const duplicatedDependencies: Record<string, string[]> = {};

    lines.forEach((packageName) => {
      if (
        !packageName ||
        !pattern.some((p) => new RegExp(`${p.replace(/\*/g, '.*')}`).test(packageName))
      ) {
        return;
      }

      const { name, value } = parsePackageData(packageName.replaceAll(`"`, ''));
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
    });

    return {
      dependencies: acc,
      duplicatedDependencies,
      infoCommand: 'yarn why',
      dedupeCommand: 'yarn dedupe',
    };
  }

  public parseErrorFromLogs(logs: string): string {
    const finalMessage = 'YARN2 error';
    const errorCodesWithMessages: { code: string; message: string }[] = [];
    const regex = /(YN\d{4}): (.+)/g;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(logs)) !== null) {
      const code = match[1];
      const message = match[2].replace(/[┌│└]/g, '').trim();
      if (code in CRITICAL_YARN2_ERROR_CODES) {
        errorCodesWithMessages.push({
          code,
          message: `${
            CRITICAL_YARN2_ERROR_CODES[code as keyof typeof CRITICAL_YARN2_ERROR_CODES]
          }\n-> ${message}\n`,
        });
      }
    }

    return [
      finalMessage,
      errorCodesWithMessages.map(({ code, message }) => `${code}: ${message}`).join('\n'),
    ].join('\n');
  }
}

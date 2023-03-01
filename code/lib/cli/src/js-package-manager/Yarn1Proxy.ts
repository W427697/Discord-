import { JsPackageManager } from './JsPackageManager';
import type { PackageJson } from './PackageJson';

export class Yarn1Proxy extends JsPackageManager {
  readonly type = 'yarn1';

  installArgs: string[] | undefined;

  getInstallArgs(): string[] {
    if (!this.installArgs) {
      this.installArgs = [];

      if (this.detectWorkspaceRoot()) {
        this.installArgs.push('-W');
      }
    }
    return this.installArgs;
  }

  detectWorkspaceRoot() {
    const { workspaces } = this.readPackageJson();

    if (Array.isArray(workspaces)) {
      return workspaces.length > 0;
    }

    if (workspaces && typeof workspaces === 'object') {
      if (workspaces.packages) {
        return workspaces.packages.length > 0;
      }
      return false;
    }

    return false;
  }

  initPackageJson() {
    return this.executeCommand('yarn', ['init', '-y']);
  }

  getRunStorybookCommand(): string {
    return 'yarn storybook';
  }

  getRunCommand(command: string): string {
    return `yarn ${command}`;
  }

  runPackageCommand(command: string, args: string[], cwd?: string): string {
    return this.executeCommand(`yarn`, [command, ...args], undefined, cwd);
  }

  protected getResolutions(packageJson: PackageJson, versions: Record<string, string>) {
    return {
      resolutions: {
        ...packageJson.resolutions,
        ...versions,
      },
    };
  }

  protected runInstall(): void {
    this.executeCommand('yarn', ['install', ...this.getInstallArgs()], 'inherit');
  }

  protected runAddDeps(dependencies: string[], installAsDevDependencies: boolean): void {
    let args = ['--ignore-workspace-root-check', ...dependencies];

    if (installAsDevDependencies) {
      args = ['-D', ...args];
    }

    this.executeCommand('yarn', ['add', ...args, ...this.getInstallArgs()], 'inherit');
  }

  protected runRemoveDeps(dependencies: string[]): void {
    const args = ['--ignore-workspace-root-check', ...dependencies];

    this.executeCommand('yarn', ['remove', ...args, ...this.getInstallArgs()], 'inherit');
  }

  protected runGetVersions<T extends boolean>(
    packageName: string,
    fetchAllVersions: T
  ): Promise<T extends true ? string[] : string> {
    const args = [fetchAllVersions ? 'versions' : 'version', '--json'];

    const commandResult = this.executeCommand('yarn', ['info', packageName, ...args]);

    try {
      const parsedOutput = JSON.parse(commandResult);
      if (parsedOutput.type === 'inspect') {
        return parsedOutput.data;
      }
      throw new Error(`Unable to find versions of ${packageName} using yarn`);
    } catch (e) {
      throw new Error(`Unable to find versions of ${packageName} using yarn`);
    }
  }
}

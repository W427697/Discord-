import command from 'execa';
import memoize from 'memoizerific';

export type Workspace = { name: string; location: string };

async function getWorkspaces() {
  const { stdout } = await command('yarn workspaces list --json', {
    cwd: process.cwd(),
    shell: true,
  });
  return JSON.parse(`[${stdout.split('\n').join(',')}]`) as Workspace[];
}

const getWorkspacesMemo = memoize(1)(getWorkspaces);

export async function workspacePath(type: string, packageName: string) {
  const workspaces = await getWorkspacesMemo();
  const workspace = workspaces.find((w) => w.name === packageName);
  if (!workspace) {
    throw new Error(`Unknown ${type} '${packageName}', not in yarn workspace!`);
  }
  return workspace.location;
}

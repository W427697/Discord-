import { join, dirname } from 'path';
import { ensureDir, exists, readFile, writeFile } from 'fs-extra';

interface VerifyOptions {
  pid: number;
  ppid: number;
  port: string | number;
  appDir: boolean;
  previewPath: string;
}

const writePidFile = async ({
  pid,
  ppid,
  appDir,
  previewPath,
}: VerifyOptions): Promise<boolean> => {
  const routeDir = appDir ? join('app', '(sb)') : 'pages';
  const storybookDir = join(process.cwd(), routeDir, previewPath);
  const pidFile = appDir ? join(storybookDir, 'pid', 'page.tsx') : join(storybookDir, 'pid.tsx');

  // no-op if the parent pid is already being checked
  if (await exists(pidFile)) {
    const contents = (await readFile(pidFile, 'utf8')).toString();
    if (contents.startsWith(`// ${ppid}`)) return false;
  }

  await ensureDir(dirname(pidFile));
  const pidTsx = `// ${pid}
    const page = () => <>__pid_${pid}__</>;
    export default page;`;
  await writeFile(pidFile, pidTsx);
  console.log(`Wrote pid ${pid} (${ppid})`);
  return true;
};

const PID_RE = /__pid_(\d+)__/;
const checkPidRoute = async ({ pid, ppid, port, previewPath }: VerifyOptions) => {
  const res = await fetch(`http://localhost:${port}/${previewPath}/pid`);
  const pidHtml = await res.text();
  const match = PID_RE.exec(pidHtml);
  const pidMatch = match?.[1].toString();

  if (pidMatch === pid.toString() || pidMatch === ppid.toString()) {
    console.log(`Verified NextJS pid ${pidMatch} is running on port ${port}`);
  } else {
    console.error(`NextJS server failed to start on port ${port}`);
    console.error(`Wanted pid ${pid} or parent ${ppid}, got ${pidMatch}`);
    console.error(`${pid.toString() === pidMatch} || ${ppid.toString() === pidMatch}`);
    process.exit(1);
  }
};

/**
 * Helper function to verify that the NextJS
 * server is actually running on the port we
 * requested. Since NextJS can run multiple
 * processes, defer to the parent process if
 * it has already written to the pid file.
 */
export const verifyPort = (
  port: string | number,
  { appDir, previewPath }: { appDir: boolean; previewPath: string }
) => {
  const { pid, ppid } = process;

  setTimeout(async () => {
    try {
      const written = await writePidFile({ pid, ppid, port, appDir, previewPath });
      if (written) {
        setTimeout(() => checkPidRoute({ pid, ppid, port, appDir, previewPath }), 100);
      }
    } catch (e) {
      console.error(e);
    }
  }, 200);
};

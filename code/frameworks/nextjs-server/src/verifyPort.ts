import { join } from 'path';
import { ensureDir, writeFile } from 'fs-extra';

const writePidFile = async (pid: number, { appDir }: { appDir: boolean }) => {
  const routeDir = appDir ? join('app', '(sb)') : 'pages';
  const storybookDir = join(process.cwd(), routeDir, 'storybookPreview');
  const pidFile = join(storybookDir, 'pid.tsx');

  await ensureDir(storybookDir);
  const pidTsx = `
    const page = () => <>__pid_${pid}__</>;
    export default page;
  `;
  await writeFile(pidFile, pidTsx);
};

const PID_RE = /__pid_(\d+)__/;
const checkPidRoute = async (pid: number, port: number) => {
  const res = await fetch(`http://localhost:${port}/storybookPreview/pid`);
  const pidHtml = await res.text();
  const match = PID_RE.exec(pidHtml);
  const pidMatch = match?.[1];
  if (pidMatch?.toString() !== pid.toString()) {
    console.log(`Verified NextJS server is running on port ${port}`);
  } else {
    console.error(`NextJS server failed to start on port ${port}`);
    console.error(`Wanted pid ${pid.toString()}, got ${pidMatch?.toString()}`);
    console.error(`${pid.toString() === pidMatch?.toString()}`);
    process.exit(1);
  }
};

/**
 * Helper function to verify that the NextJS
 * server is actually running on the port we
 * requested.
 */
export const verifyPort = (port: number, { appDir }: { appDir: boolean }) => {
  const { pid } = process;

  setTimeout(async () => {
    try {
      await writePidFile(pid, { appDir });
      setTimeout(() => checkPidRoute(pid, port), 100);
    } catch (e) {
      console.error(e);
    }
  }, 200);
};

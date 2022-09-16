import fs from 'fs-extra';
import type { Task } from '../task';
import { exec } from '../utils/exec';

export const chromatic: Task = {
  before: ['build'],
  junit: true,
  async ready() {
    return false;
  },
  async run(templateKey, { sandboxDir, builtSandboxDir, junitFilename }) {
    const tokenEnvVarName = `CHROMATIC_TOKEN_${templateKey.toUpperCase().replace(/\/|-/g, '_')}`;
    const token = process.env[tokenEnvVarName];
    try {
      await exec(
        `npx chromatic \
          --exit-zero-on-changes \
          --storybook-build-dir=${builtSandboxDir} \
          --junit-report=${junitFilename} \
          --projectToken=${token}`,
        { cwd: sandboxDir },
        { debug: true }
      );
    } finally {
      if (fs.existsSync(junitFilename)) {
        const junitXml = await (await fs.readFile(junitFilename)).toString();
        const prefixedXml = junitXml.replace(/classname="(.*)"/g, `classname="${templateKey} $1"`);
        await fs.writeFile(junitFilename, prefixedXml);
      }
    }
  },
};

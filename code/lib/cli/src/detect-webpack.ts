import type { JsPackageManager } from './js-package-manager';

export const detectWebpack = async (packageManager: JsPackageManager): Promise<number | false> => {
  try {
    let out = '';
    if (packageManager.type === 'npm') {
      try {
        // npm <= v7
        out = await packageManager.executeCommand({ command: 'npm', args: ['ls', 'webpack'] });
      } catch (e2) {
        // npm >= v8
        out = await packageManager.executeCommand({ command: 'npm', args: ['why', 'webpack'] });
      }
    } else {
      out = await packageManager.executeCommand({ command: 'yarn', args: ['why', 'webpack'] });
    }

    // if the user has BOTH webpack 4 and 5 installed already, we'll pick the safest options (4)
    if (out.includes('webpack@4') || out.includes('webpack@npm:4')) {
      return 4;
    }

    // the user has webpack 4 installed, but not 5
    if (out.includes('webpack@5') || out.includes('webpack@npm:5')) {
      return 5;
    }
  } catch (err) {
    //
  }

  return false;
};

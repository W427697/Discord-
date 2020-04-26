import shell from 'shelljs';

// TODO: @gaetanmaisse Lets use shelljs instead of implementing our own function
export const exec = async (command: string, options = {}) =>
  new Promise((resolve, reject) => {
    shell.exec(command, options, (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`command exited with code: ${code}`));
      }
    });
  });

const exec = require('child_process').exec;

function handleProcessClose(childProcess, resolve, reject, stepName) {
  childProcess.on(
    'close',
    code => (code === 0 ? resolve() : reject(new Error(`🛑 ${stepName} step failed`)))
  );
}

function promisifyProcess(command, step) {
  return new Promise((resolve, reject) => {
    const childProcess = exec(command);
    childProcess.stdout.pipe(process.stdout);
    childProcess.stderr.pipe(process.stdout);
    handleProcessClose(childProcess, resolve, reject, step);
  });
}

module.exports = promisifyProcess;

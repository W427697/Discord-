const exec = require('child_process').exec;

module.exports = function promiseFromCommand(command) {
  const child = exec(command);

  return new Promise((resolve, reject) => {
    const stdout = [];
    const stderr = [];
    child.stdout.on('data', data => {
      stdout.push(JSON.stringify(data));
    });
    child.stderr.on('data', data => {
      stderr.push(data.toString());
    });

    child.addListener('error', () => reject(stderr.join('')));
    child.addListener('exit', () => resolve(stdout.join('')));
  });
};

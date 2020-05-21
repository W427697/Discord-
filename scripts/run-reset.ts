import fs from 'fs';
import { spawn } from 'child_process';
import trash from 'trash';
import del from 'del';

const logger = console;

fs.writeFileSync('reset.log', '');

const cleaningProcess = spawn('git', ['clean', '-xdf', '-n']);

cleaningProcess.stdout.on('data', (data) => {
  if (data && data.toString()) {
    data
      .toString()
      .split(/\n/)
      .forEach((i: string) => {
        const [, uri] = i.match(/Would remove (.*)$/) || [];

        if (uri) {
          if (
            uri.match(/dist/) ||
            uri.match(/.vscode/) ||
            uri.match(/.idea/) ||
            uri.match(/reset.log/)
          ) {
            // ignore, don't remove these files
          } else if (
            uri.match(/node_modules/) ||
            uri.match(/dist/) ||
            uri.match(/ts3\.5/) ||
            uri.match(/\.cache/) ||
            uri.match(/dll/)
          ) {
            del(uri).then(() => {
              logger.log(`deleted ${uri}`);
            });
          } else {
            trash(uri)
              .then(() => {
                logger.log(`trashed ${uri}`);
              })
              .catch(() => {
                logger.log('failed to trash, will try permanent delete');
                del(uri).then(() => {
                  logger.log(`deleted ${uri}`);
                });
              });
          }
        }
      });
  }
  fs.appendFile('reset.log', data, (err) => {
    if (err) {
      throw err;
    }
  });
});
cleaningProcess.on('exit', (code) => {
  if (code === 0) {
    logger.log('all went well, files are being trashed now');
  } else {
    logger.error(code);
  }
});

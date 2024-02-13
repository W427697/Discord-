import fs from 'fs';
import path from 'path';

export function convertMdToMdx(directoryPath: string) {
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      return console.error('Unable to scan directory: ' + err);
    }
    files.forEach((file) => {
      const filePath = path.join(directoryPath, file);
      fs.stat(filePath, (err1, stats) => {
        if (err1) {
          console.error('Unable to get file stats: ' + err1);
          return;
        }
        if (stats.isDirectory()) {
          convertMdToMdx(filePath);
        } else {
          if (path.extname(file) === '.md') {
            const newPath = path.join(directoryPath, path.parse(file).name + '.mdx');
            fs.rename(filePath, newPath, (err2) => {
              if (err2) throw err2;
            });
          }
        }
      });
    });
  });
}

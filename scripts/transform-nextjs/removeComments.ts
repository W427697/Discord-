import fs from 'fs';
import path from 'path';

export function removecomments(directoryPath: string) {
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
          removecomments(filePath);
        } else {
          if (path.extname(file) === '.mdx' || path.extname(file) === '.md') {
            fs.readFile(filePath, 'utf8', (err2, data) => {
              if (err2) {
                console.error('Unable to read file: ' + err2);
                return;
              }

              const newData = data.replace(/\n<!-- prettier-ignore-start -->\n/g, '');

              fs.writeFile(filePath, newData, 'utf8', (err3) => {
                if (err3) throw err3;
                console.log(`Updated file: ${file}`);
              });
            });
          }
        }
      });
    });
  });
}

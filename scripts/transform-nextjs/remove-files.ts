import fs from 'fs';

export function removeFiles() {
  const filePath1 = './docs/frameworks.js';
  if (fs.existsSync(filePath1)) fs.unlinkSync(filePath1);

  const filePath2 = './docs/toc.js';
  if (fs.existsSync(filePath2)) fs.unlinkSync(filePath2);

  const folder1 = './docs/versions';
  if (fs.existsSync(folder1))
    fs.rm(folder1, { recursive: true, force: true }, (error) => {
      if (error) console.log(error);
    });

  const folder2 = './docs/snippets';
  if (fs.existsSync(folder2))
    fs.rm(folder2, { recursive: true, force: true }, (error) => {
      if (error) console.log(error);
    });

  const folder3 = './docs/assets';
  if (fs.existsSync(folder3))
    fs.rm(folder3, { recursive: true, force: true }, (error) => {
      if (error) console.log(error);
    });
}

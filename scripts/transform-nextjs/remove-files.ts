import fs from 'fs';

export function removeFiles() {
  const filePath1 = './docs/frameworks.js';
  if (fs.existsSync(filePath1)) fs.unlinkSync(filePath1);

  const filePath2 = './docs/toc.js';
  if (fs.existsSync(filePath2)) fs.unlinkSync(filePath2);
}

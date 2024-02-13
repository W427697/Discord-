import fs from 'fs';
import path from 'path';

export function moveMediaFiles(
  sourceDirectory: string,
  targetDirectory: string,
  currentDirectory = sourceDirectory
) {
  const files = fs.readdirSync(currentDirectory);

  files.forEach((file) => {
    const filePath = path.join(currentDirectory, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      moveMediaFiles(sourceDirectory, targetDirectory, filePath);
    } else {
      const ext = path.extname(file).toLowerCase();
      if (['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp', '.mp4'].includes(ext)) {
        const relativePath = path.relative(sourceDirectory, currentDirectory);
        const targetPathDirectory = path.join(targetDirectory, relativePath);

        if (!fs.existsSync(targetPathDirectory)) {
          fs.mkdirSync(targetPathDirectory, { recursive: true });
        }

        const targetPath = path.join(targetPathDirectory, file);
        fs.renameSync(filePath, targetPath);
      }
    }
  });
}

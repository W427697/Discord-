import fs from 'fs';
import path from 'path';

export function moveMediaFiles(sourceDirectory: string, targetDirectory: string) {
  if (!fs.existsSync(targetDirectory)) {
    fs.mkdirSync(targetDirectory, { recursive: true });
  }

  const files = fs.readdirSync(sourceDirectory);

  files.forEach((file: any) => {
    const filePath = path.join(sourceDirectory, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      moveMediaFiles(filePath, targetDirectory);
    } else {
      const ext = path.extname(file).toLowerCase();
      if (
        ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp', '.mp4', '.mov', '.avi', '.mkv'].includes(
          ext
        )
      ) {
        const targetPath = path.join(targetDirectory, file);
        fs.renameSync(filePath, targetPath);
      }
    }
  });
}

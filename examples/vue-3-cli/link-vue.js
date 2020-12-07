const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');

const action = process.argv[2];

async function renameToBackup(p) {
  await fs.promises.rename(path.resolve(__dirname, p), path.resolve(__dirname, `${p}--backup`));
}

async function renameToOriginal(p) {
  await fs.promises.rename(path.resolve(__dirname, `${p}--backup/`), path.resolve(__dirname, p));
}

const modules = ['vue', 'vue-loader'];

async function link() {
  return Promise.all(
    modules.map(async (module) => {
      if (fs.existsSync(`../../node_modules/${module}`)) {
        await renameToBackup(`../../node_modules/${module}`);
      }
      await fs.promises.symlink(
        path.resolve(__dirname, `./node_modules/${module}/`),
        path.resolve(__dirname, `../../node_modules/${module}/`)
      );
    })
  );
}

async function unlink() {
  return Promise.all(
    modules.map(async (module) => {
      if (fs.existsSync(`../../node_modules/${module}--backup`)) {
        rimraf.sync(path.resolve(__dirname, `../../node_modules/${module}`));
        await renameToOriginal(`../../node_modules/${module}`);
      }
    })
  );
}

(async () => {
  if (action !== 'unlink') {
    await link();
  } else {
    await unlink();
  }
})().catch((err) => {
  console.error(err);
  process.exit(1);
});

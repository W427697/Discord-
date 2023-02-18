/**
 * Util script for synchronizing docs with frontpage repository.
 * For running it:
 * - cd /storybook/docs
 * - node sync.js 
 */
const fs = require('fs');
const readline = require('readline');
const path = require('path');

const askQuestion = (query) => {
  const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
  });

  return new Promise(resolve => rl.question(`${query}\n`, ans => {
      rl.close();
      resolve(ans);
  }))
}

const run = async () => {
  let frontpageDocsPath = '/src/content/docs'

  const frontpageAbsPath = await askQuestion('Provide the frontpage project absolute path:')
  frontpageDocsPath = `${frontpageAbsPath}${frontpageDocsPath}`;
  
  if (!fs.existsSync(frontpageDocsPath)) {
    console.error(`The directory ${frontpageDocsPath} doesn't exists`);
    process.exit(1)
  }

  console.log(`Synchronizing files from: \n${__dirname} \nto: \n${frontpageDocsPath}`)
  
  fs.watch(__dirname , {recursive: true}, (_, filename) => {
    const srcFilePath = path.join(__dirname, filename);
    const targetFilePath = path.join(frontpageDocsPath, filename);
    const targetDir = targetFilePath.split('/').slice(0, -1).join('/');

    if (filename === 'sync.js') return;

    //Syncs create file
    if (!fs.existsSync(targetFilePath)) {
      fs.mkdirSync(targetDir, {recursive: true})

      try {
        fs.closeSync(fs.openSync(targetFilePath, 'w'));
        console.log(`Created ${filename}.`);
      } catch (error) {
        throw error;
      }
    }
    
    //Syncs remove file
    if (!fs.existsSync(srcFilePath)) {
      try {
        fs.unlinkSync(targetFilePath);
        console.log(`Removed ${filename}.`);
      } catch (error) {
        throw error;
      }
      return;
    }

    //Syncs update file
    fs.copyFile(srcFilePath, targetFilePath, (err) => {
      console.log(`Updated ${filename}.`);
      if (err) throw err;
    });
  })
}

run();
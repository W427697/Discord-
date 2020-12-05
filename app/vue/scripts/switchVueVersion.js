const Vue = require('vue');
const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const chalk = require('chalk');

const version = Number(process.env.VUE_VERSION) || ((Vue.version || '').charAt(0) === '3' ? 3 : 2);
const vueFilePath = path.resolve(__dirname, '../src/vue/index.ts');

console.log(`Switching to Vue version: ${chalk.yellow(version)}`);

function switchVersion(v) {
  if (v === 2) {
    const data = fs.readFileSync(vueFilePath).toString();
    fs.writeFileSync(vueFilePath, data.replace(/\/v3\//g, '/v2/'), 'utf-8');
    rimraf.sync(path.resolve(vueFilePath, '../v3'));
  } else {
    rimraf.sync(path.resolve(vueFilePath, '../v2'));
  }
}

switchVersion(version);

const Vue = require('vue');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const version = (Vue.version || '').charAt(0) === '3' ? 3 : 2;
const vueFilePath = path.resolve(__dirname, '../src/vue/index.ts');

console.log(`Switching to Vue version: ${chalk.yellow(version)}`);

function switchVersion(v) {
  if (v === 2) {
    const data = fs.readFileSync(vueFilePath).toString();
    fs.writeFileSync(vueFilePath, data.replace(/\/v3\//g, '/v2/'), 'utf-8');
  }
}

switchVersion(version);

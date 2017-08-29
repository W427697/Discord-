const exec = require('child_process').exec;
const generateSitemap = require('./tasks/sitemap');

const sitemapReady = generateSitemap().then(() => console.log('🗺 ', 'Sitemap generated'));

/* 
 * This script runs the command 'next build' in node production mode
 * If succesfull we proceed with 'next export'
 * We pipe all the output of the process directly into the output of this script's output
 */
Promise.all([sitemapReady])
  .then(
    () =>
      new Promise((resolve, reject) => {
        const build = exec('NODE_END="production" next build');
        build.stdout.pipe(process.stdout);
        build.on(
          'close',
          code => (code === 0 ? resolve() : reject(new Error('🛑 build step failed')))
        );
      })
  )
  .then(
    () =>
      new Promise((resolve, reject) => {
        const build = exec('NODE_END="production" next export');
        build.stdout.pipe(process.stdout);
        build.stderr.pipe(process.stdout);
        build.on(
          'close',
          code => (code === 0 ? resolve() : reject(new Error('🛑 export step failed')))
        );
      })
  )
  .catch(error => {
    // we wait a bit to let the stderr be printed
    setTimeout(() => console.log(error), 500);
  });

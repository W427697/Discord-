const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const path = require('path');

const folderToTree = require('../../lib/dirToTree');
const md5 = require('md5');
const prettier = require('prettier');
const lodash = require('lodash');

const promiseFromCommand = require('../../lib/promiseFromCommand');

const existingSitemap = (() => {
  try {
    // eslint-disable-next-line global-require
    return require('../../lib/sitemap');
  } catch (error) {
    return {};
  }
})();

const getExistingKey = key =>
  existingSitemap[key]
    ? existingSitemap[key]
    : {
        files: [],
        contributors: [],
      };

/* 
 * This script detects markdown-files in /content
 * and generates a sitemap.js in /lib
 * each file is enriched with file statistics
 * and contributors (based on git blame)
 */

const authorMatchString = 'Author: (.+?) <(.+?)>';
const allAuthorsRegexp = new RegExp(authorMatchString, 'g');
const authorRegexp = new RegExp(authorMatchString);

const appFolder = path.join(__dirname, '..', '..');
const pagesFolder = path.join(appFolder, 'pages');
const contentFolder = path.join(appFolder, 'content');

/* Read the git '.mailmap' file and parse it and the metadata */
const mailmapLineSplitter = /([^<]*) <([^>]*)>[^#\n]*(?:#\s?(.*))?/;
const mailmapData = fs
  .readFileAsync(path.join(__dirname, '..', '..', '..', '.mailmap'), 'utf8')
  .then(raw =>
    raw
      .split('\n')
      .filter(i => i[0] && i[0].match(/[a-zA-Z0-9]/))
      .map(i => i.match(mailmapLineSplitter))
      .map(([, name, email, meta = '']) => ({
        name,
        email,
        meta: meta.split(',').reduce((acc, item) => {
          const [key, value] = item.split(':');
          return key && value ? Object.assign(acc, { [key.trim()]: value.trim() }) : acc;
        }, {}),
      }))
      .reduce(
        (acc, item = {}) =>
          Object.assign(acc, {
            [item.email]: {
              name: item.name || acc[item.email].name,
              meta: Object.assign({}, item.meta, (acc[item.email] || {}).meta),
            },
          }),
        {}
      )
  );

/* Convert a deeply nested tree into a flat structure */
const normalize = (list, acc = {}) =>
  list.reduce((localAcc, item) => {
    const localItem = Object.assign({}, item, { files: [] });
    if (item.files && item.files.length) {
      normalize(item.files, localAcc); // recursion
      const keys = item.files.map(i => i.route);
      localItem.files = keys;
    }
    // eslint-disable-next-line no-param-reassign
    localAcc[item.route] = Object.assign(localAcc[item.route] || {}, localItem);
    return localAcc;
  }, acc);

/* Extend a file object with a list of contributors from git log
 * 1. Get git mailmap (a file mapping email to proper name & metadata)
 * 2. Get git log and find contributors
 * 3. Make contributors unique and extend with metadata
 * 4. Error handling
 * 5. Return extended file */
const getContributors = item =>
  Promise.all([
    mailmapData,
    promiseFromCommand(
      `git --no-pager log --follow --summary -p -- ${path.join(
        contentFolder,
        `${item.route}.md`
      )} &&
       git --no-pager log --follow --summary -p -- ${path.join(pagesFolder, `${item.route}.js`)}`
    ),
  ])
    .then(([mailmap, result]) =>
      (result.match(allAuthorsRegexp) || [])
        .map(string => {
          const [, name, email] = string.match(authorRegexp);
          const hash = md5(email);

          return { name, hash, email };
        })
        .reduce((acc, { name, hash, email }, index, list) => {
          acc[hash] = { name, email };
          if (index < list.length - 1) {
            return acc;
          }
          return Object.keys(acc).map(key =>
            Object.assign(
              {
                hash: key,
                name: acc[key].name,
              },
              mailmap[acc[key].email]
            )
          );
        }, {})
    )
    .catch(error => {
      console.log(error);
      return [];
    })
    .then(contributors =>
      Object.assign(item, { contributors: contributors.length ? contributors : [] })
    );

/* Main sequence - write a sitemap
 * 1. get a data-tree representation of the content-folder
 * 2. normalize data into flat structure
 * 3. add contributors
 * 4. deepmerge with existing sitemap
 *    (This way a partial git history won't break a old contributors list)
 * 5. Write into file (formatted by prettier) */
const run = () =>
  folderToTree(pagesFolder, pagesFolder)
    .then(data => {
      const localData = normalize(data);

      return Promise.all(
        Object.keys(localData)
          .map(key => localData[key])
          .map(item => (item.isFile ? getContributors(item) : Promise.resolve(item)))
      );
    })
    .then(list => list.reduce((acc, item) => Object.assign(acc, { [item.route]: item }), {}))
    .then(data =>
      Object.keys(data).reduce(
        (acc, key) => ({
          ...acc,
          [key]: {
            ...data[key],
            contributors: lodash.uniqBy(
              [].concat(data[key].contributors).concat(getExistingKey(key).contributors),
              'hash'
            ),
          },
        }),
        {}
      )
    )
    .then(data => {
      let result;
      let message = '';
      try {
        result = `module.exports = ${JSON.stringify(data, null, 2)}`;
      } catch (error) {
        message = `/* ${error} */`;
        result = 'module.exports = {}';
      }
      return fs.writeFileAsync(
        path.join(appFolder, 'lib', 'sitemap.js'),
        prettier.format([result, message].join('\n'), {
          printWidth: 100,
          tabWidth: 2,
          bracketSpacing: true,
          trailingComma: 'es5',
          singleQuote: true,
        })
      );
    })
    .catch(error => {
      console.log(error);
    });

module.exports = run;

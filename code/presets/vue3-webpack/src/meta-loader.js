const path = require('path');
const { createComponentMetaCheckerByJsonConfig } = require('vue-component-meta');
const MagicString = require('magic-string');

const checkerOptions = {
  forceUseTs: true,
  schema: { ignore: ['MyIgnoredNestedProps'] },
  printer: { newLine: 1 },
};

module.exports = async function (source, map) {
  const checker = createComponentMetaCheckerByJsonConfig(
    path.join(__dirname, '../../../../'),
    checkerOptions
  );
  console.log('\n\n ----*** meta-loader checker ', checker);

  console.log(' \n*** meta-loader :resourcePath', this.resourcePath); // , '\n', source);
  const src = source;
  const id = this.resourcePath;
  let metaSource;
  try {
    const meta = checker.getComponentMeta(id);
    console.log(' *** meta-loader meta ', meta);
    metaSource = {
      exportName: checker.getExportNames(id)[0],
      displayName: id
        .split(path.sep)
        .slice(-1)
        .join('')
        .replace(/\.(vue|ts)/, ''),
      ...meta,
      sourceFiles: id,
    };

    metaSource = JSON.stringify(metaSource);
  } catch (e) {
    console.log(' *** meta-loader error ', e);
  }

  const s = new MagicString(src);

  s.append(`;_sfc_main.__docgenInfo = ${metaSource}`);
  this.callback(null, s.toString(), map);
};

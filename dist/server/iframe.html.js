'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

exports.default = function (data) {
  var assets = data.assets,
      headHtml = data.headHtml,
      publicPath = data.publicPath;


  var urls = urlsFromAssets(assets);

  var cssTags = urls.css.map(function (u) {
    return '<link rel=\'stylesheet\' type=\'text/css\' href=\'' + _url2.default.resolve(publicPath, u) + '\'>';
  }).join('\n');
  var scriptTags = urls.js.map(function (u) {
    return '<script src="' + _url2.default.resolve(publicPath, u) + '"></script>';
  }).join('\n');

  return '\n    <!DOCTYPE html>\n    <html>\n      <head>\n        <meta charset="utf-8">\n        <meta name="viewport" content="width=device-width, initial-scale=1">\n        <script>\n          if (window.parent !== window) {\n            window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = window.parent.__REACT_DEVTOOLS_GLOBAL_HOOK__;\n          }\n        </script>\n        <title>React Storybook</title>\n        ' + headHtml + '\n        ' + cssTags + '\n      </head>\n      <body>\n        <div id="root"></div>\n        <div id="error-display"></div>\n        ' + scriptTags + '\n      </body>\n    </html>\n  ';
};

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// assets.preview will be:
// - undefined
// - string e.g. 'static/preview.9adbb5ef965106be1cc3.bundle.js'
// - array of strings e.g.
// [ 'static/preview.9adbb5ef965106be1cc3.bundle.js',
//   'preview.0d2d3d845f78399fd6d5e859daa152a9.css',
//   'static/preview.9adbb5ef965106be1cc3.bundle.js.map',
//   'preview.0d2d3d845f78399fd6d5e859daa152a9.css.map' ]
var urlsFromAssets = function urlsFromAssets(assets) {
  if (!assets) {
    return {
      js: ['static/preview.bundle.js'],
      css: []
    };
  }

  var urls = {
    js: [],
    css: []
  };

  var re = /.+\.(\w+)$/;
  (0, _keys2.default)(assets)
  // Don't load the manager script in the iframe
  .filter(function (key) {
    return key !== 'manager';
  }).forEach(function (key) {
    var asset = assets[key];
    if (typeof asset === 'string') {
      urls[re.exec(asset)[1]].push(asset);
    } else {
      var assetUrl = asset.find(function (u) {
        return re.exec(u)[1] !== 'map';
      });
      urls[re.exec(assetUrl)[1]].push(assetUrl);
    }
  });

  return urls;
};
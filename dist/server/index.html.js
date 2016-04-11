'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  return '\n    <!DOCTYPE html>\n    <html>\n      <head>\n        <title>React Storybook</title>\n        <script type="text/javascript">\n          window.dataId = \'' + _uuid2.default.v4() + '\';\n        </script>\n        <link href=\'https://fonts.googleapis.com/css?family=Open+Sans:400,300,300italic,400italic,600,600italic,700,700italic\' rel=\'stylesheet\' type=\'text/css\'>\n        <style>\n          /*\n            When resizing panels, the drag event breaks if the cursor\n            moves over the iframe. Add the \'dragging\' class to the body\n            at drag start and remove it when the drag ends.\n           */\n          .dragging iframe {\n            pointer-events: none;\n          }\n          h5 {\n              margin: 10px 0;\n          }\n          h4 {\n              font-size: 16px;\n              margin: 10px 0;\n          }\n        </style>\n      </head>\n      <body style="margin: 0;">\n        <div id="root" />\n        <script src="/static/admin.bundle.js"></script>\n      </body>\n    </html>\n  ';
};

var _uuid = require('uuid');

var _uuid2 = _interopRequireDefault(_uuid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
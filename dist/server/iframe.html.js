"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (headHtml) {
  return "\n    <!DOCTYPE html>\n    <html>\n      <head>\n        <title>React Storybook</title>\n        " + headHtml + "\n        <link href='https://fonts.googleapis.com/css?family=Open+Sans:400,300,300italic,400italic,600,600italic,700,700italic' rel='stylesheet' type='text/css'>\n        <style>\n            html {\n                font-family: 'Open Sans', Helvetica, Arial, sans-serif;\n            }\n        </style>\n      </head>\n      <body>\n        <div id=\"root\" />\n        <script src=\"/static/preview.bundle.js\"></script>\n      </body>\n    </html>\n  ";
};
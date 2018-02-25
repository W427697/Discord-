const preview = require('./dist/preview');

exports.addViewports = preview.addViewports;
exports.setViewports = preview.setViewports;

preview.init();

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var server_1 = require("@storybook/core/server");
var register_1 = __importDefault(require("babel-plugin-require-context-hook/register"));
var global_1 = __importDefault(require("global"));
register_1.default();
var isFile = function (file) {
    try {
        return fs_1.default.lstatSync(file).isFile();
    }
    catch (e) {
        return false;
    }
};
var supportedExtensions = ['ts', 'tsx', 'js', 'jsx'];
var resolveFile = function (configDir, supportedFilenames) {
    return supportedFilenames
        .flatMap(function (filename) { return supportedExtensions.map(function (ext) { return path_1.default.join(configDir, filename + "." + ext); }); })
        .find(isFile) || false;
};
exports.getPreviewFile = function (configDir) {
    return resolveFile(configDir, ['preview', 'config']);
};
exports.getMainFile = function (configDir) { return resolveFile(configDir, ['main']); };
function getConfigPathParts(input) {
    var configDir = path_1.default.resolve(input);
    if (fs_1.default.lstatSync(configDir).isDirectory()) {
        var output = { files: [], stories: [] };
        var preview = exports.getPreviewFile(configDir);
        var main = exports.getMainFile(configDir);
        if (preview) {
            output.files.push(preview);
        }
        if (main) {
            var _a = require.requireActual(main).stories, stories = _a === void 0 ? [] : _a;
            output.stories = stories.map(function (pattern) {
                var _a = server_1.toRequireContext(pattern), basePath = _a.path, recursive = _a.recursive, match = _a.match;
                // eslint-disable-next-line no-underscore-dangle
                return global_1.default.__requireContext(configDir, basePath, recursive, new RegExp(match.slice(1, -1)));
            });
        }
        return output;
    }
    return { files: [configDir], stories: [] };
}
function configure(options) {
    var _a = options.configPath, configPath = _a === void 0 ? '.storybook' : _a, config = options.config, storybook = options.storybook;
    if (config && typeof config === 'function') {
        config(storybook);
        return;
    }
    var _b = getConfigPathParts(configPath), files = _b.files, stories = _b.stories;
    files.forEach(function (f) {
        require.requireActual(f);
    });
    if (stories && stories.length) {
        storybook.configure(stories, false);
    }
}
exports.default = configure;

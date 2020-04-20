"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// eslint-disable-next-line import/no-extraneous-dependencies
var vue_1 = __importDefault(require("vue"));
function getRenderedTree(story) {
    var component = story.render();
    var vm = new vue_1.default({
        render: function (h) {
            return h(component);
        },
    });
    return vm.$mount().$el;
}
exports.default = getRenderedTree;

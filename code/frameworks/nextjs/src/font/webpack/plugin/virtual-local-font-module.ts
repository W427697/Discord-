// Write a webpack plugin that will create a virtual module for each custom font,
// which will be used by the storybook-nextjs-font-loader to generate the CSS

import type { Compiler } from 'webpack';

export default class VirtualLocalFontModulePlugin {
  apply(compiler: Compiler) {
    // Tap into each import which starts with "storybook-nextjs-font-loader"
    compiler.hooks.normalModuleFactory.tap('VirtualLocalFontModulePlugin', (nmf) => {
      nmf.hooks.beforeResolve.tap('VirtualLocalFontModulePlugin', (data) => {
        if (data.request.startsWith('storybook-nextjs-font-loader')) {
          const { issuer } = data.contextInfo;
          const fontLoaderParameters = JSON.parse(data.request.split('?')[1].split('!')[0]);
        }
      });
    });
  }
}

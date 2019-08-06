const config = require('../../jest.config');

// Our goals here are two fold:
//
// 1. Compile Svelte files down to JS.
//
// 2. Svelte internals, compiled components must be applied the same babel transforms,
//    in particular regarding classes (because ES5 classes -- i.e. functions -- can
//    not extend ES2015 classes). Actually, all of our lib code should also use the
//    same transform, but we're letting the default babel script play out and just
//    hope for the best, currently.
//
// FIXME Something should probably be done to ensure that the class transform, and
// ideally the same whole babel config is/ always applied to core / addons files
// by our scripts/babel-jest.js script.
//
// NOTE We're using the same svelte-transform script for *.svelte and svelte internals
// mainly because I didn't have time to figure out how to make it work with existing
// babel-jest.js script.
//
module.exports = {
  ...config,
  roots: [__dirname],
  transform: {
    // svelte internals are passed through svelte-transform to be sure that they
    // are applied the same babel configuration as .svelte files
    //
    // NOTE this line must be before the default config.transform, or its *.js
    // rule will take precedence
    '.*/node_modules/svelte/.+\\.m?js$': '<rootDir>/svelte-transform',

    ...config.transform,

    '^.+\\.svelte$': '<rootDir>/svelte-transform',
  },
  transformIgnorePatterns: ['node_modules/(?!(svelte)/)'],
  moduleFileExtensions: [...config.moduleFileExtensions, 'svelte'],
};

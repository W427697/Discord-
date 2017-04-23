#!/usr/bin/env node

const mochify = require('mochify');
const istanbul = require('mochify-istanbul');

mochify('./test/*.js', {
  reporter: 'dot',
  transform: ['babelify'],
})
  .plugin(istanbul, {
    report: ['lcovonly'],
  })
  .bundle();

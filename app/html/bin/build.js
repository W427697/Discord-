#!/usr/bin/env node
process.env.NODE_ENV = process.env.NODE_ENV || 'production';

require('esm')(module, { cache: true })('../dist/server/build');

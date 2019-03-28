#!/usr/bin/env node -r esm

process.env.NODE_ENV = process.env.NODE_ENV || 'production';
require('../dist/server/build');

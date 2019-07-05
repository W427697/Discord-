#!/usr/bin/env node --max-old-space-size=4069

process.env.NODE_ENV = process.env.NODE_ENV || 'production';
require('../dist/server/build');

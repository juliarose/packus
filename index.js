#!/usr/bin/env node
const argv = require('yargs')
    .option('src', {
        type: 'string',
        description: 'Source directory (relative or absolute)'
    })
    .option('output', {
        type: 'string',
        description: 'Output filename (relative or absolute)'
    })
    .default('src', './')
    .default('output', './output.user.js')
    .command(require('./lib/commands/init'))
    .command(require('./lib/commands/build'))
    .demandCommand()
    .help()
    .argv;
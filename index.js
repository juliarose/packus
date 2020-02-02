#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const builder = require('./lib/builder');
const initialize = require('./lib/initialize');
const getPaths = require('./lib/getPaths');
const colors = {
    grey: '\x1b[2m%s\x1b[0m',
    yellow: '\x1b[33m%s\x1b[0m',
    white: '\x1b[37m%s\x1b[0m',
    bgGreen: '\x1b[42m%s\x1b[0m',
    bgBlack: '\x1b[40m%s\x1b[0m',
    cyan: '\x1b[36m%s\x1b[0m'
};
const exit = () => {
    process.exit(0);
};
const args = process.argv.slice(2);
const command = args[0];

// trim command from arguments
args.shift();

switch (command) {
    case 'init': {
        const {srcDir} = getPaths(...args);
        const templateDir = path.join(__dirname, 'templates');
        
        initialize(srcDir, templateDir);
        console.log(
            colors.bgGreen,
            'Project initialized.'
        );
        console.log(
            `Modify the files in ${srcDir} to build onto the script.`
        );
        console.log(
            colors.yellow,
            '- <srcdir>/deps.js is a file which should return a value to be passed to all page scripts.'
        );
        console.log(
            colors.yellow,
            '- <srcdir>/meta.js is the userscript block. Any includes will be automatically ' +
            'injected from page scripts.'
        );
        console.log(
            colors.yellow,
            '- <srcdir>/js is where all page scripts should reside.'
        );
        console.log();
        console.log('Example page script file:');
        console.log(
            colors.grey,
            [
                '// @include https://www.google.com',
                'function({ add }) { add(1, 2); }'
            ].join('\n')
        );
        console.log();
        console.log(
            colors.yellow,
            '- <srcdir>/css is where all CSS files should reside. ' +
            'The filename of the CSS file should match a file in <srcdir>/js.'
        );
        console.log();
        console.log(
            colors.cyan,
            'Refer to https://github.com/juliarose/packus/tree/master/example for an example.'
        );
        console.log();
        console.log(
            colors.cyan,
            'To build your script run "packus build <srcdir> <name of script>".\n' +
            'The srcdir path can be either relative or absolute.'
        );
        
        exit();
    } break;
    case 'build': {
        const {srcDir, outputPath} = getPaths(...args);
        // build the script and meta file contents from source directory
        const {script, meta} = builder(srcDir);
        const userscriptPath = outputPath + '.user.js';
        const metaPath = outputPath + '.meta.js';
        
        // write the files
        // userscript
        fs.writeFileSync(
            userscriptPath,
            script,
            'utf8'
        );
        // userscript meta file
        fs.writeFileSync(
            metaPath,
            meta,
            'utf8'
        );
        console.log(
            colors.bgGreen,
            'Script files written to file.'
        );
        
        exit();
    } break;
    default: {
        const manPath = path.join(__dirname, 'man.txt');
        const man = fs.readFileSync(manPath, 'utf8');
        
        // show manual
        logger.log(man);
        exit();
    } break;
}
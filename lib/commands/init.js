const path = require('path');
const initialize = require('../initialize');
const getPaths = require('../getPaths');
const colors = {
    grey: '\x1b[2m%s\x1b[0m',
    yellow: '\x1b[33m%s\x1b[0m',
    white: '\x1b[37m%s\x1b[0m',
    bgGreen: '\x1b[42m%s\x1b[0m',
    bgBlack: '\x1b[40m%s\x1b[0m',
    cyan: '\x1b[36m%s\x1b[0m'
};

module.exports = {
    command: 'init',
    desc: 'Initializes a new userscript project',
    handler: (argv) => {
        const {srcDir} = getPaths(argv);
        const upTwo = path.join(__dirname, '../../');
        const templateDir = path.join(upTwo, 'templates');
        
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
            '- <srcdir>/js is where all page scripts should reside. Each file should be headed by one or more @include comments.'
        );
        console.log();
        console.log('Example:');
        console.log(
            colors.grey,
            [
                '// @include https://www.google.com',
                'function({ add }) {',
                '    add(1, 2);',
                '}'
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
            colors.white,
            'Refer to https://github.com/juliarose/packus/tree/master/example for an example.'
        );
        console.log();
        console.log(
            colors.cyan,
            'To build your script run "packus build <srcdir> <name of script>".\n' +
            'The srcdir path can be either relative or absolute.'
        );
    }
};
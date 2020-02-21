const fs = require('fs');
const builder = require('../builder');
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
    command: 'build',
    desc: 'Builds userscript from source',
    handler: (argv) => {
        let {srcDir, outputPath} = getPaths(argv);
        
        // remove script file extension if one was added
        outputPath = outputPath.replace(/(\.user)?\.js$/, '');
        
        // build the script and meta file contents from source directory
        const {script, meta} = builder(srcDir);
        const userscriptPath = outputPath + '.user.js';
        const metaPath = outputPath + '.meta.js';
        
        // write the files
        // userscript
        console.log(
            colors.grey,
            `Writing ${userscriptPath}...`
        );
        fs.writeFileSync(
            userscriptPath,
            script,
            'utf8'
        );
        console.log(
            colors.grey,
            `Writing ${metaPath}...`
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
    }
};
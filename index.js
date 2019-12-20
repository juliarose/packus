#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const builder = require('./app/builder');
const initializer = require('./app/initializer');
const logger = require('./app/logger');
const {
    checkSrcDirState,
    checkBuildState
} = require('./app/checkstate');

const exit = () => {
    process.exit(0);
};
const args = process.argv.slice(2);
const command = args[0];

// trim command from arguments
args.shift();

switch (command) {
    case 'init': {
        const initialize = (srcDir) => {
            const templateDir = path.join(__dirname, 'templates');
            
            return initializer(srcDir, templateDir);
        };
        
        checkSrcDirState(...args)
            //  initalize with directory returned from checked directory
            .then(initialize)
            .then(exit)
            .catch((error) => {
                if (error) {
                    logger.log(error);
                }
                
                exit();
            });
    } break;
    case 'build': {
        const output = ({srcDir, outputPath}) => {
            // build the script and meta file contents from source directory
            const {
                script,
                meta
            } = builder(srcDir);
            const userscriptPath = outputPath + '.user.js';
            const metaPath = outputPath + '.meta.js';
            
            // write the files
            // userscript
            fs.writeFileSync(
                userscriptPath,
                script,
                'utf8'
            );
            logger.log(`${userscriptPath} written to file`);
            // userscript meta file
            fs.writeFileSync(
                metaPath,
                meta,
                'utf8'
            );
            logger.log(`${metaPath} written to file`);
        };
        
        checkBuildState(...args)
            .then(output)
            .then(exit)
            .catch((error) => {
                if (error) {
                    logger.log(error);
                }
                
                exit();
            });
    } break;
    default: {
        const manPath = path.join(__dirname, 'man.txt');
        const man = fs.readFileSync(manPath, 'utf8');
        
        // show manual
        logger.log(man);
        exit();
    } break;
}